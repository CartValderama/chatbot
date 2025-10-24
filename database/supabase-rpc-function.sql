-- ================================================
-- Custom RPC Function for Raw SQL Execution
-- Run this in Supabase SQL Editor after creating the schema
-- ================================================

-- This function allows executing raw SQL queries through Supabase RPC
-- It's needed because Supabase doesn't support raw SQL queries by default
CREATE OR REPLACE FUNCTION exec_raw_sql(sql_query TEXT, sql_params JSONB DEFAULT '[]'::jsonb)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  query_type TEXT;
BEGIN
  -- Determine query type
  query_type := UPPER(TRIM(SPLIT_PART(sql_query, ' ', 1)));

  -- Execute the query and return results
  IF query_type = 'SELECT' THEN
    -- For SELECT queries, return the data as JSON
    EXECUTE sql_query INTO result USING sql_params;
    RETURN result;
  ELSE
    -- For INSERT, UPDATE, DELETE queries
    EXECUTE sql_query USING sql_params;
    -- Return a success indicator
    RETURN '{"success": true}'::jsonb;
  END IF;

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error executing query: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_raw_sql(TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_raw_sql(TEXT, JSONB) TO anon;
