-- ================================================
-- Healthcare Chatbot Database Implementation
-- For Elder Care System with Doctor Interface
-- ================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS healthcare_chatbot;
USE healthcare_chatbot;

-- ================================================
-- 1. DOCTORS TABLE
-- ================================================
CREATE TABLE Doctors (
    Doctor_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Speciality VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Hospital VARCHAR(150),
    License_Number VARCHAR(50) UNIQUE,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 2. USERS (ELDERS) TABLE
-- ================================================
CREATE TABLE Users (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Birth_Date DATE,
    Gender ENUM('Male', 'Female', 'Other'),
    Phone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Address TEXT,
    Primary_Doctor_ID INT,
    Registration_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Primary_Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE SET NULL
);

-- ================================================
-- 3. LOGIN CREDENTIALS TABLE
-- ================================================
CREATE TABLE Login_Credentials (
    Login_ID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    User_Type ENUM('Elder', 'Doctor') NOT NULL,
    User_ID INT NULL,
    Doctor_ID INT NULL,
    Last_Login TIMESTAMP NULL,
    Account_Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE CASCADE,
    CHECK (
        (User_Type = 'Elder' AND User_ID IS NOT NULL AND Doctor_ID IS NULL) OR
        (User_Type = 'Doctor' AND Doctor_ID IS NOT NULL AND User_ID IS NULL)
    )
);

-- ================================================
-- 4. MEDICINES TABLE
-- ================================================
CREATE TABLE Medicines (
    Medicine_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(150) NOT NULL,
    Type VARCHAR(50),
    Dosage VARCHAR(50),
    Side_Effects TEXT,
    Instructions TEXT,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 5. PRESCRIPTIONS TABLE
-- ================================================
CREATE TABLE Prescriptions (
    Prescription_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Doctor_ID INT NOT NULL,
    Medicine_ID INT NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Dosage VARCHAR(50),
    Frequency VARCHAR(100),
    Instructions TEXT,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Medicine_ID) REFERENCES Medicines(Medicine_ID) ON DELETE CASCADE
);

-- ================================================
-- 6. REMINDERS TABLE
-- ================================================
CREATE TABLE Reminders (
    Reminder_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Prescription_ID INT NOT NULL,
    Reminder_DateTime DATETIME NOT NULL,
    Status ENUM('Pending', 'Sent', 'Acknowledged', 'Missed') DEFAULT 'Pending',
    Notes TEXT,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Prescription_ID) REFERENCES Prescriptions(Prescription_ID) ON DELETE CASCADE
);

-- ================================================
-- 7. CHAT MESSAGES TABLE
-- ================================================
CREATE TABLE Chat_Messages (
    Message_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Message_Text TEXT NOT NULL,
    Sender_Type ENUM('User', 'Bot') NOT NULL,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Intent VARCHAR(100),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ================================================
-- 8. HEALTH RECORDS TABLE
-- ================================================
CREATE TABLE Health_Records (
    Record_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Date_Time DATETIME NOT NULL,
    Heart_Rate INT,
    Blood_Pressure VARCHAR(20),
    Blood_Sugar DECIMAL(5,2),
    Temperature DECIMAL(4,2),
    Notes TEXT,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ================================================
-- SAMPLE DATA FOR TESTING
-- ================================================

-- Insert Sample Doctors
INSERT INTO Doctors (Name, Speciality, Phone, Email, Hospital, License_Number) VALUES
('Dr. Sarah Johnson', 'Cardiology', '+47-123-45678', 'sarah.johnson@hospital.no', 'Oslo University Hospital', 'DOC-12345'),
('Dr. Michael Chen', 'General Practice', '+47-234-56789', 'michael.chen@hospital.no', 'Akershus University Hospital', 'DOC-23456'),
('Dr. Emma Wilson', 'Geriatrics', '+47-345-67890', 'emma.wilson@hospital.no', 'Oslo University Hospital', 'DOC-34567');

-- Insert Sample Users (Elders)
INSERT INTO Users (First_Name, Last_Name, Birth_Date, Gender, Phone, Email, Address, Primary_Doctor_ID) VALUES
('Anna', 'Hansen', '1945-03-15', 'Female', '+47-912-34567', 'anna.hansen@email.no', 'Storgata 10, Oslo', 1),
('Per', 'Olsen', '1950-07-22', 'Male', '+47-923-45678', 'per.olsen@email.no', 'Hovedveien 25, Oslo', 2),
('Kari', 'Larsen', '1948-11-08', 'Female', '+47-934-56789', 'kari.larsen@email.no', 'Bergveien 5, Oslo', 3);

-- Insert Login Credentials (Password: 'password123' - In real app, use proper hashing!)
-- Note: These are example hashes - use bcrypt or similar in production
INSERT INTO Login_Credentials (Username, Password_Hash, User_Type, User_ID, Doctor_ID) VALUES
('anna.hansen', '$2y$10$example_hash_for_anna', 'Elder', 1, NULL),
('per.olsen', '$2y$10$example_hash_for_per', 'Elder', 2, NULL),
('kari.larsen', '$2y$10$example_hash_for_kari', 'Elder', 3, NULL),
('dr.johnson', '$2y$10$example_hash_for_sarah', 'Doctor', NULL, 1),
('dr.chen', '$2y$10$example_hash_for_michael', 'Doctor', NULL, 2),
('dr.wilson', '$2y$10$example_hash_for_emma', 'Doctor', NULL, 3);

-- Insert Sample Medicines
INSERT INTO Medicines (Name, Type, Dosage, Side_Effects, Instructions) VALUES
('Aspirin', 'Pain Reliever', '100mg', 'Nausea, stomach pain', 'Take with food'),
('Metformin', 'Diabetes', '500mg', 'Diarrhea, nausea', 'Take with meals'),
('Lisinopril', 'Blood Pressure', '10mg', 'Dizziness, dry cough', 'Take once daily in morning'),
('Atorvastatin', 'Cholesterol', '20mg', 'Muscle pain, headache', 'Take at bedtime'),
('Warfarin', 'Blood Thinner', '5mg', 'Bleeding, bruising', 'Take at same time daily');

-- Insert Sample Prescriptions
INSERT INTO Prescriptions (User_ID, Doctor_ID, Medicine_ID, Start_Date, End_Date, Dosage, Frequency, Instructions) VALUES
(1, 1, 3, '2024-01-01', '2025-01-01', '10mg', 'Once daily', 'Take in the morning'),
(1, 1, 1, '2024-01-01', '2024-12-31', '100mg', 'Once daily', 'Take with food'),
(2, 2, 2, '2024-02-01', '2025-02-01', '500mg', 'Twice daily', 'Take with breakfast and dinner'),
(3, 3, 4, '2024-03-01', '2025-03-01', '20mg', 'Once daily', 'Take at bedtime');

-- Insert Sample Reminders
INSERT INTO Reminders (User_ID, Prescription_ID, Reminder_DateTime, Status, Notes) VALUES
(1, 1, '2024-10-21 08:00:00', 'Pending', 'Morning medication'),
(1, 2, '2024-10-21 12:00:00', 'Pending', 'Afternoon medication'),
(2, 3, '2024-10-21 08:00:00', 'Pending', 'Breakfast medication'),
(2, 3, '2024-10-21 19:00:00', 'Pending', 'Dinner medication');

-- Insert Sample Chat Messages
INSERT INTO Chat_Messages (User_ID, Message_Text, Sender_Type, Intent) VALUES
(1, 'What are the side effects of my blood pressure medication?', 'User', 'medication_info'),
(1, 'Lisinopril may cause dizziness and dry cough. Contact your doctor if symptoms persist.', 'Bot', 'medication_info'),
(2, 'When should I take my diabetes medication?', 'User', 'medication_schedule'),
(2, 'Take Metformin 500mg with breakfast and dinner.', 'Bot', 'medication_schedule');

-- Insert Sample Health Records
INSERT INTO Health_Records (User_ID, Date_Time, Heart_Rate, Blood_Pressure, Blood_Sugar, Temperature, Notes) VALUES
(1, '2024-10-20 08:00:00', 72, '120/80', 95.5, 36.8, 'Normal readings'),
(1, '2024-10-19 08:00:00', 75, '125/82', 98.0, 36.9, 'Slightly elevated BP'),
(2, '2024-10-20 09:00:00', 68, '118/76', 145.0, 37.0, 'Blood sugar elevated'),
(3, '2024-10-20 07:30:00', 70, '115/75', 92.0, 36.7, 'All readings normal');

-- ================================================
-- USEFUL QUERIES FOR YOUR APPLICATION
-- ================================================

-- Query 1: Verify Login
-- Example: Check if username and password match
-- SELECT * FROM Login_Credentials 
-- WHERE Username = 'anna.hansen' AND Password_Hash = 'hashed_password' AND Account_Status = 'Active';

-- Query 2: Get User Profile with Doctor Info
SELECT 
    u.User_ID, 
    u.First_Name, 
    u.Last_Name, 
    u.Email, 
    u.Phone,
    d.Name AS Doctor_Name,
    d.Speciality,
    d.Phone AS Doctor_Phone
FROM Users u
LEFT JOIN Doctors d ON u.Primary_Doctor_ID = d.Doctor_ID
WHERE u.User_ID = 1;

-- Query 3: Get Active Prescriptions for a User
SELECT 
    p.Prescription_ID,
    m.Name AS Medicine_Name,
    p.Dosage,
    p.Frequency,
    p.Start_Date,
    p.End_Date,
    d.Name AS Prescribed_By
FROM Prescriptions p
JOIN Medicines m ON p.Medicine_ID = m.Medicine_ID
JOIN Doctors d ON p.Doctor_ID = d.Doctor_ID
WHERE p.User_ID = 1 
AND p.End_Date >= CURDATE();

-- Query 4: Get Today's Reminders for a User
SELECT 
    r.Reminder_ID,
    r.Reminder_DateTime,
    m.Name AS Medicine_Name,
    p.Dosage,
    r.Status
FROM Reminders r
JOIN Prescriptions p ON r.Prescription_ID = p.Prescription_ID
JOIN Medicines m ON p.Medicine_ID = m.Medicine_ID
WHERE r.User_ID = 1 
AND DATE(r.Reminder_DateTime) = CURDATE()
ORDER BY r.Reminder_DateTime;

-- Query 5: Get Chat History for a User
SELECT 
    Message_ID,
    Message_Text,
    Sender_Type,
    Timestamp
FROM Chat_Messages
WHERE User_ID = 1
ORDER BY Timestamp DESC
LIMIT 20;

-- Query 6: Get Latest Health Records
SELECT 
    Record_ID,
    Date_Time,
    Heart_Rate,
    Blood_Pressure,
    Blood_Sugar,
    Temperature,
    Notes
FROM Health_Records
WHERE User_ID = 1
ORDER BY Date_Time DESC
LIMIT 10;

-- Query 7: Doctor's Patient List
SELECT 
    u.User_ID,
    CONCAT(u.First_Name, ' ', u.Last_Name) AS Patient_Name,
    u.Birth_Date,
    u.Phone,
    u.Email,
    COUNT(DISTINCT p.Prescription_ID) AS Active_Prescriptions
FROM Users u
LEFT JOIN Prescriptions p ON u.User_ID = p.User_ID AND p.End_Date >= CURDATE()
WHERE u.Primary_Doctor_ID = 1
GROUP BY u.User_ID;

-- Query 8: Medication Adherence Report
SELECT 
    u.First_Name,
    u.Last_Name,
    COUNT(CASE WHEN r.Status = 'Acknowledged' THEN 1 END) AS Taken,
    COUNT(CASE WHEN r.Status = 'Missed' THEN 1 END) AS Missed,
    COUNT(*) AS Total_Reminders,
    ROUND(COUNT(CASE WHEN r.Status = 'Acknowledged' THEN 1 END) * 100.0 / COUNT(*), 2) AS Adherence_Rate
FROM Users u
JOIN Reminders r ON u.User_ID = r.User_ID
WHERE r.Reminder_DateTime >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY u.User_ID;

-- ================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ================================================
CREATE INDEX idx_user_email ON Users(Email);
CREATE INDEX idx_doctor_email ON Doctors(Email);
CREATE INDEX idx_login_username ON Login_Credentials(Username);
CREATE INDEX idx_prescription_user ON Prescriptions(User_ID);
CREATE INDEX idx_reminder_user_date ON Reminders(User_ID, Reminder_DateTime);
CREATE INDEX idx_chat_user_time ON Chat_Messages(User_ID, Timestamp);
CREATE INDEX idx_health_user_date ON Health_Records(User_ID, Date_Time);

-- ================================================
-- END OF DATABASE IMPLEMENTATION
-- ================================================