# Database Setup Instructions

## Prerequisites

- MySQL Server (version 5.7 or higher) or MariaDB installed on your system
- MySQL command-line client or MySQL Workbench

## Setup Steps

### 1. Install MySQL (if not already installed)

**Windows:**
- Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
- Run the installer and follow the setup wizard
- Remember the root password you set during installation

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 2. Create the Database

Open MySQL command line or MySQL Workbench and run the SQL file:

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p < healthcare_chatbot.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. File → Open SQL Script → Select `healthcare_chatbot.sql`
4. Execute the script (lightning bolt icon)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local` in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Update the database credentials in `.env.local`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=healthcare_chatbot
   ```

### 4. Verify Database Setup

Connect to MySQL and verify the database:
```bash
mysql -u root -p
```

Then run:
```sql
USE healthcare_chatbot;
SHOW TABLES;
SELECT * FROM Users;
```

You should see 8 tables and sample data for 3 users (Anna, Per, and Kari).

## Database Structure

The database includes the following tables:

- **Users** - Elder users/patients
- **Doctors** - Healthcare providers
- **Login_Credentials** - Authentication for both users and doctors
- **Medicines** - Medication information
- **Prescriptions** - Medication prescriptions for users
- **Reminders** - Medication reminder schedules
- **Chat_Messages** - Conversation history
- **Health_Records** - Health monitoring data

## Sample Login Credentials

Three elder users are pre-configured:

1. **Anna Hansen**
   - Email: anna.hansen@email.no
   - Username: anna.hansen
   - Password: password123

2. **Per Olsen**
   - Email: per.olsen@email.no
   - Username: per.olsen
   - Password: password123

3. **Kari Larsen**
   - Email: kari.larsen@email.no
   - Username: kari.larsen
   - Password: password123

## Troubleshooting

### Connection Errors

If you get "Access denied" errors:
```sql
-- Create a new MySQL user
CREATE USER 'chatbot_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON healthcare_chatbot.* TO 'chatbot_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update `.env.local` with the new user credentials.

### Port Issues

If MySQL is running on a different port (default is 3306), add to `.env.local`:
```env
DB_PORT=3307
```

### Reset Database

To reset the database and start fresh:
```sql
DROP DATABASE healthcare_chatbot;
```

Then re-run the `healthcare_chatbot.sql` script.

## Next Steps

After setting up the database:
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Navigate to http://localhost:3000
4. Login with one of the sample user credentials
