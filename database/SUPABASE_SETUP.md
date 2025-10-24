# Supabase Database Setup Instructions

Follow these steps to set up your Supabase database for the Healthcare Chatbot application.

## Step 1: Create Tables and Sample Data

1. Go to your Supabase project: https://hmlkzgoufaxszkfgaxth.supabase.co
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `database/supabase-schema.sql`
5. Click **Run** to execute the script

This will create all necessary tables and insert sample data.

## Step 2: Create the RPC Function (Required for Raw SQL)

1. In the same **SQL Editor**, create another new query
2. Copy and paste the contents of `database/supabase-rpc-function.sql`
3. Click **Run** to create the function

This function allows the application to execute raw SQL queries through Supabase.

## Step 3: Verify the Setup

After running both scripts, verify that:

1. All 8 tables were created:
   - doctors
   - users
   - login_credentials
   - medicines
   - prescriptions
   - reminders
   - chat_messages
   - health_records

2. Sample data was inserted (3 users, 3 doctors, 5 medicines, etc.)

3. The `exec_raw_sql` function was created successfully

## Step 4: Test the Connection

Your `.env.local` file should already contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://hmlkzgoufaxszkfgaxth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Restart your development server:
```bash
npm run dev
```

Try logging in with one of the test users:
- Email: anna.hansen@email.no
- Password: password123 (or any password with 6+ characters)

## Troubleshooting

If you encounter errors:

1. **Tables already exist**: Drop all tables first by running:
   ```sql
   DROP TABLE IF EXISTS health_records CASCADE;
   DROP TABLE IF EXISTS chat_messages CASCADE;
   DROP TABLE IF EXISTS reminders CASCADE;
   DROP TABLE IF EXISTS prescriptions CASCADE;
   DROP TABLE IF EXISTS medicines CASCADE;
   DROP TABLE IF EXISTS login_credentials CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   DROP TABLE IF EXISTS doctors CASCADE;
   ```

2. **RPC function errors**: Make sure you're using the **SQL Editor** and not the Functions tab

3. **Connection errors**: Verify your `.env.local` file has the correct URL and API key

## Row Level Security (Optional)

For production, you should enable Row Level Security (RLS) policies. For development, RLS is disabled by default which allows the anon key to access all data.

To enable RLS later:
1. Go to **Authentication** > **Policies** in Supabase dashboard
2. Enable RLS for each table
3. Create policies for read/write access
