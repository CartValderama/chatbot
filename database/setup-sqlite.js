const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'healthcare_chatbot.db');
const db = new Database(dbPath);

console.log('Setting up SQLite database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Drop existing tables if they exist
console.log('Dropping existing tables...');
db.exec(`
  DROP TABLE IF EXISTS Chat_Messages;
  DROP TABLE IF EXISTS Health_Records;
  DROP TABLE IF EXISTS Reminders;
  DROP TABLE IF EXISTS Prescriptions;
  DROP TABLE IF EXISTS Login_Credentials;
  DROP TABLE IF EXISTS Medicines;
  DROP TABLE IF EXISTS Users;
  DROP TABLE IF EXISTS Doctors;
`);

// Create tables
console.log('Creating tables...');

db.exec(`
  CREATE TABLE Doctors (
    Doctor_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Speciality TEXT,
    Phone TEXT,
    Email TEXT UNIQUE,
    Hospital TEXT,
    License_Number TEXT UNIQUE,
    Created_Date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE Users (
    User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    First_Name TEXT NOT NULL,
    Last_Name TEXT NOT NULL,
    Birth_Date DATE,
    Gender TEXT CHECK(Gender IN ('Male', 'Female', 'Other')),
    Phone TEXT,
    Email TEXT UNIQUE,
    Address TEXT,
    Primary_Doctor_ID INTEGER,
    Registration_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Primary_Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE SET NULL
  );

  CREATE TABLE Login_Credentials (
    Login_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT UNIQUE NOT NULL,
    Password_Hash TEXT NOT NULL,
    User_Type TEXT NOT NULL CHECK(User_Type IN ('Elder', 'Doctor')),
    User_ID INTEGER,
    Doctor_ID INTEGER,
    Last_Login DATETIME,
    Account_Status TEXT DEFAULT 'Active' CHECK(Account_Status IN ('Active', 'Inactive', 'Suspended')),
    Created_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE CASCADE
  );

  CREATE TABLE Medicines (
    Medicine_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Type TEXT,
    Dosage TEXT,
    Side_Effects TEXT,
    Instructions TEXT,
    Created_Date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE Prescriptions (
    Prescription_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    User_ID INTEGER NOT NULL,
    Doctor_ID INTEGER NOT NULL,
    Medicine_ID INTEGER NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Dosage TEXT,
    Frequency TEXT,
    Instructions TEXT,
    Created_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Medicine_ID) REFERENCES Medicines(Medicine_ID) ON DELETE CASCADE
  );

  CREATE TABLE Reminders (
    Reminder_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    User_ID INTEGER NOT NULL,
    Prescription_ID INTEGER NOT NULL,
    Reminder_DateTime DATETIME NOT NULL,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Sent', 'Acknowledged', 'Missed')),
    Notes TEXT,
    Created_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Prescription_ID) REFERENCES Prescriptions(Prescription_ID) ON DELETE CASCADE
  );

  CREATE TABLE Chat_Messages (
    Message_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    User_ID INTEGER NOT NULL,
    Message_Text TEXT NOT NULL,
    Sender_Type TEXT NOT NULL CHECK(Sender_Type IN ('User', 'Bot')),
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Intent TEXT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
  );

  CREATE TABLE Health_Records (
    Record_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    User_ID INTEGER NOT NULL,
    Date_Time DATETIME NOT NULL,
    Heart_Rate INTEGER,
    Blood_Pressure TEXT,
    Blood_Sugar REAL,
    Temperature REAL,
    Notes TEXT,
    Created_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
  );
`);

// Insert sample data
console.log('Inserting sample data...');

// Insert Doctors
const insertDoctors = db.prepare(`
  INSERT INTO Doctors (Name, Speciality, Phone, Email, Hospital, License_Number)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertDoctors.run('Dr. Sarah Johnson', 'Cardiology', '+47-123-45678', 'sarah.johnson@hospital.no', 'Oslo University Hospital', 'DOC-12345');
insertDoctors.run('Dr. Michael Chen', 'General Practice', '+47-234-56789', 'michael.chen@hospital.no', 'Akershus University Hospital', 'DOC-23456');
insertDoctors.run('Dr. Emma Wilson', 'Geriatrics', '+47-345-67890', 'emma.wilson@hospital.no', 'Oslo University Hospital', 'DOC-34567');

// Insert Users
const insertUsers = db.prepare(`
  INSERT INTO Users (First_Name, Last_Name, Birth_Date, Gender, Phone, Email, Address, Primary_Doctor_ID)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertUsers.run('Anna', 'Hansen', '1945-03-15', 'Female', '+47-912-34567', 'anna.hansen@email.no', 'Storgata 10, Oslo', 1);
insertUsers.run('Per', 'Olsen', '1950-07-22', 'Male', '+47-923-45678', 'per.olsen@email.no', 'Hovedveien 25, Oslo', 2);
insertUsers.run('Kari', 'Larsen', '1948-11-08', 'Female', '+47-934-56789', 'kari.larsen@email.no', 'Bergveien 5, Oslo', 3);

// Insert Login Credentials
const insertLogin = db.prepare(`
  INSERT INTO Login_Credentials (Username, Password_Hash, User_Type, User_ID, Doctor_ID)
  VALUES (?, ?, ?, ?, ?)
`);

insertLogin.run('anna.hansen', '$2y$10$example_hash_for_anna', 'Elder', 1, null);
insertLogin.run('per.olsen', '$2y$10$example_hash_for_per', 'Elder', 2, null);
insertLogin.run('kari.larsen', '$2y$10$example_hash_for_kari', 'Elder', 3, null);
insertLogin.run('dr.johnson', '$2y$10$example_hash_for_sarah', 'Doctor', null, 1);
insertLogin.run('dr.chen', '$2y$10$example_hash_for_michael', 'Doctor', null, 2);
insertLogin.run('dr.wilson', '$2y$10$example_hash_for_emma', 'Doctor', null, 3);

// Insert Medicines
const insertMedicines = db.prepare(`
  INSERT INTO Medicines (Name, Type, Dosage, Side_Effects, Instructions)
  VALUES (?, ?, ?, ?, ?)
`);

insertMedicines.run('Aspirin', 'Pain Reliever', '100mg', 'Nausea, stomach pain', 'Take with food');
insertMedicines.run('Metformin', 'Diabetes', '500mg', 'Diarrhea, nausea', 'Take with meals');
insertMedicines.run('Lisinopril', 'Blood Pressure', '10mg', 'Dizziness, dry cough', 'Take once daily in morning');
insertMedicines.run('Atorvastatin', 'Cholesterol', '20mg', 'Muscle pain, headache', 'Take at bedtime');
insertMedicines.run('Warfarin', 'Blood Thinner', '5mg', 'Bleeding, bruising', 'Take at same time daily');

// Insert Prescriptions
const insertPrescriptions = db.prepare(`
  INSERT INTO Prescriptions (User_ID, Doctor_ID, Medicine_ID, Start_Date, End_Date, Dosage, Frequency, Instructions)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertPrescriptions.run(1, 1, 3, '2024-01-01', '2025-01-01', '10mg', 'Once daily', 'Take in the morning');
insertPrescriptions.run(1, 1, 1, '2024-01-01', '2024-12-31', '100mg', 'Once daily', 'Take with food');
insertPrescriptions.run(2, 2, 2, '2024-02-01', '2025-02-01', '500mg', 'Twice daily', 'Take with breakfast and dinner');
insertPrescriptions.run(3, 3, 4, '2024-03-01', '2025-03-01', '20mg', 'Once daily', 'Take at bedtime');

// Insert Reminders - Using today's date for testing
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const insertReminders = db.prepare(`
  INSERT INTO Reminders (User_ID, Prescription_ID, Reminder_DateTime, Status, Notes)
  VALUES (?, ?, ?, ?, ?)
`);

insertReminders.run(1, 1, `${todayStr} 08:00:00`, 'Pending', 'Morning medication');
insertReminders.run(1, 2, `${todayStr} 12:00:00`, 'Pending', 'Afternoon medication');
insertReminders.run(2, 3, `${todayStr} 08:00:00`, 'Pending', 'Breakfast medication');
insertReminders.run(2, 3, `${todayStr} 19:00:00`, 'Pending', 'Dinner medication');
insertReminders.run(3, 4, `${todayStr} 21:00:00`, 'Pending', 'Evening medication');

// Insert Sample Chat Messages
const insertChat = db.prepare(`
  INSERT INTO Chat_Messages (User_ID, Message_Text, Sender_Type, Intent)
  VALUES (?, ?, ?, ?)
`);

insertChat.run(1, 'What are the side effects of my blood pressure medication?', 'User', 'medication_info');
insertChat.run(1, 'Lisinopril may cause dizziness and dry cough. Contact your doctor if symptoms persist.', 'Bot', 'medication_info');
insertChat.run(2, 'When should I take my diabetes medication?', 'User', 'medication_schedule');
insertChat.run(2, 'Take Metformin 500mg with breakfast and dinner.', 'Bot', 'medication_schedule');

// Insert Sample Health Records
const insertHealth = db.prepare(`
  INSERT INTO Health_Records (User_ID, Date_Time, Heart_Rate, Blood_Pressure, Blood_Sugar, Temperature, Notes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertHealth.run(1, `${todayStr} 08:00:00`, 72, '120/80', 95.5, 36.8, 'Normal readings');
insertHealth.run(2, `${todayStr} 09:00:00`, 68, '118/76', 145.0, 37.0, 'Blood sugar elevated');
insertHealth.run(3, `${todayStr} 07:30:00`, 70, '115/75', 92.0, 36.7, 'All readings normal');

// Create indexes
console.log('Creating indexes...');
db.exec(`
  CREATE INDEX idx_user_email ON Users(Email);
  CREATE INDEX idx_doctor_email ON Doctors(Email);
  CREATE INDEX idx_login_username ON Login_Credentials(Username);
  CREATE INDEX idx_prescription_user ON Prescriptions(User_ID);
  CREATE INDEX idx_reminder_user_date ON Reminders(User_ID, Reminder_DateTime);
  CREATE INDEX idx_chat_user_time ON Chat_Messages(User_ID, Timestamp);
  CREATE INDEX idx_health_user_date ON Health_Records(User_ID, Date_Time);
`);

console.log('✅ Database setup complete!');
console.log(`Database created at: ${dbPath}`);
console.log('\nSample data:');
console.log('- 3 Doctors');
console.log('- 3 Users (Anna Hansen, Per Olsen, Kari Larsen)');
console.log('- 5 Medicines');
console.log('- 4 Prescriptions');
console.log(`- ${db.prepare('SELECT COUNT(*) as count FROM Reminders').get().count} Reminders for today`);
console.log('\nYou can now run: npm run dev');

db.close();
