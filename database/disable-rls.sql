-- ================================================
-- Disable Row Level Security for Development
-- Run this in Supabase SQL Editor
-- ================================================

-- This allows the anon key to access all data
-- IMPORTANT: Only use for development/testing!
-- For production, enable RLS and create proper policies

ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_credentials DISABLE ROW LEVEL SECURITY;
ALTER TABLE medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_records DISABLE ROW LEVEL SECURITY;
