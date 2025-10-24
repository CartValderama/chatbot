-- ================================================
-- Healthcare Chatbot Database for Supabase (PostgreSQL)
-- ================================================

-- Enable UUID extension (optional, using serial for compatibility)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. DOCTORS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    speciality VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    hospital VARCHAR(150),
    license_number VARCHAR(50) UNIQUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 2. USERS (ELDERS) TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    primary_doctor_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (primary_doctor_id) REFERENCES doctors(doctor_id) ON DELETE SET NULL
);

-- ================================================
-- 3. LOGIN CREDENTIALS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS login_credentials (
    login_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(10) CHECK (user_type IN ('Elder', 'Doctor')) NOT NULL,
    user_id INT NULL,
    doctor_id INT NULL,
    last_login TIMESTAMP NULL,
    account_status VARCHAR(20) CHECK (account_status IN ('Active', 'Inactive', 'Suspended')) DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    CHECK (
        (user_type = 'Elder' AND user_id IS NOT NULL AND doctor_id IS NULL) OR
        (user_type = 'Doctor' AND doctor_id IS NOT NULL AND user_id IS NULL)
    )
);

-- ================================================
-- 4. MEDICINES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS medicines (
    medicine_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    dosage VARCHAR(50),
    side_effects TEXT,
    instructions TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 5. PRESCRIPTIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    medicine_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    dosage VARCHAR(50),
    frequency VARCHAR(100),
    instructions TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id) ON DELETE CASCADE
);

-- ================================================
-- 6. REMINDERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS reminders (
    reminder_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    prescription_id INT NOT NULL,
    reminder_datetime TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Sent', 'Acknowledged', 'Missed')) DEFAULT 'Pending',
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE
);

-- ================================================
-- 7. CHAT MESSAGES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sender_type VARCHAR(10) CHECK (sender_type IN ('User', 'Bot')) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    intent VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ================================================
-- 8. HEALTH RECORDS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS health_records (
    record_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date_time TIMESTAMP NOT NULL,
    heart_rate INT,
    blood_pressure VARCHAR(20),
    blood_sugar DECIMAL(5,2),
    temperature DECIMAL(4,2),
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ================================================
-- SAMPLE DATA FOR TESTING
-- ================================================

-- Insert Sample Doctors
INSERT INTO doctors (name, speciality, phone, email, hospital, license_number) VALUES
('Dr. Sarah Johnson', 'Cardiology', '+47-123-45678', 'sarah.johnson@hospital.no', 'Oslo University Hospital', 'DOC-12345'),
('Dr. Michael Chen', 'General Practice', '+47-234-56789', 'michael.chen@hospital.no', 'Akershus University Hospital', 'DOC-23456'),
('Dr. Emma Wilson', 'Geriatrics', '+47-345-67890', 'emma.wilson@hospital.no', 'Oslo University Hospital', 'DOC-34567')
ON CONFLICT DO NOTHING;

-- Insert Sample Users (Elders)
INSERT INTO users (first_name, last_name, birth_date, gender, phone, email, address, primary_doctor_id) VALUES
('Anna', 'Hansen', '1945-03-15', 'Female', '+47-912-34567', 'anna.hansen@email.no', 'Storgata 10, Oslo', 1),
('Per', 'Olsen', '1950-07-22', 'Male', '+47-923-45678', 'per.olsen@email.no', 'Hovedveien 25, Oslo', 2),
('Kari', 'Larsen', '1948-11-08', 'Female', '+47-934-56789', 'kari.larsen@email.no', 'Bergveien 5, Oslo', 3)
ON CONFLICT DO NOTHING;

-- Insert Login Credentials (Password: 'password123' - simple for demo)
INSERT INTO login_credentials (username, password_hash, user_type, user_id, doctor_id) VALUES
('anna.hansen', '$2y$10$example_hash_for_anna', 'Elder', 1, NULL),
('per.olsen', '$2y$10$example_hash_for_per', 'Elder', 2, NULL),
('kari.larsen', '$2y$10$example_hash_for_kari', 'Elder', 3, NULL),
('dr.johnson', '$2y$10$example_hash_for_sarah', 'Doctor', NULL, 1),
('dr.chen', '$2y$10$example_hash_for_michael', 'Doctor', NULL, 2),
('dr.wilson', '$2y$10$example_hash_for_emma', 'Doctor', NULL, 3)
ON CONFLICT DO NOTHING;

-- Insert Sample Medicines
INSERT INTO medicines (name, type, dosage, side_effects, instructions) VALUES
('Aspirin', 'Pain Reliever', '100mg', 'Nausea, stomach pain', 'Take with food'),
('Metformin', 'Diabetes', '500mg', 'Diarrhea, nausea', 'Take with meals'),
('Lisinopril', 'Blood Pressure', '10mg', 'Dizziness, dry cough', 'Take once daily in morning'),
('Atorvastatin', 'Cholesterol', '20mg', 'Muscle pain, headache', 'Take at bedtime'),
('Warfarin', 'Blood Thinner', '5mg', 'Bleeding, bruising', 'Take at same time daily')
ON CONFLICT DO NOTHING;

-- Insert Sample Prescriptions
INSERT INTO prescriptions (user_id, doctor_id, medicine_id, start_date, end_date, dosage, frequency, instructions) VALUES
(1, 1, 3, '2024-01-01', '2025-01-01', '10mg', 'Once daily', 'Take in the morning'),
(1, 1, 1, '2024-01-01', '2024-12-31', '100mg', 'Once daily', 'Take with food'),
(2, 2, 2, '2024-02-01', '2025-02-01', '500mg', 'Twice daily', 'Take with breakfast and dinner'),
(3, 3, 4, '2024-03-01', '2025-03-01', '20mg', 'Once daily', 'Take at bedtime')
ON CONFLICT DO NOTHING;

-- Insert Sample Reminders (using today's date + time)
INSERT INTO reminders (user_id, prescription_id, reminder_datetime, status, notes) VALUES
(1, 1, CURRENT_DATE + TIME '08:00:00', 'Pending', 'Morning medication'),
(1, 2, CURRENT_DATE + TIME '12:00:00', 'Pending', 'Afternoon medication'),
(2, 3, CURRENT_DATE + TIME '08:00:00', 'Pending', 'Breakfast medication'),
(2, 3, CURRENT_DATE + TIME '19:00:00', 'Pending', 'Dinner medication')
ON CONFLICT DO NOTHING;

-- Insert Sample Chat Messages
INSERT INTO chat_messages (user_id, message_text, sender_type, intent) VALUES
(1, 'What are the side effects of my blood pressure medication?', 'User', 'medication_info'),
(1, 'Lisinopril may cause dizziness and dry cough. Contact your doctor if symptoms persist.', 'Bot', 'medication_info'),
(2, 'When should I take my diabetes medication?', 'User', 'medication_schedule'),
(2, 'Take Metformin 500mg with breakfast and dinner.', 'Bot', 'medication_schedule')
ON CONFLICT DO NOTHING;

-- Insert Sample Health Records
INSERT INTO health_records (user_id, date_time, heart_rate, blood_pressure, blood_sugar, temperature, notes) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '1 day', 72, '120/80', 95.5, 36.8, 'Normal readings'),
(1, CURRENT_TIMESTAMP - INTERVAL '2 days', 75, '125/82', 98.0, 36.9, 'Slightly elevated BP'),
(2, CURRENT_TIMESTAMP - INTERVAL '1 day', 68, '118/76', 145.0, 37.0, 'Blood sugar elevated'),
(3, CURRENT_TIMESTAMP - INTERVAL '1 day', 70, '115/75', 92.0, 36.7, 'All readings normal')
ON CONFLICT DO NOTHING;

-- ================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_doctor_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_login_username ON login_credentials(username);
CREATE INDEX IF NOT EXISTS idx_prescription_user ON prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_user_date ON reminders(user_id, reminder_datetime);
CREATE INDEX IF NOT EXISTS idx_chat_user_time ON chat_messages(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_health_user_date ON health_records(user_id, date_time);

-- ================================================
-- END OF DATABASE IMPLEMENTATION
-- ================================================
