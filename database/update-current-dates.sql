-- ================================================
-- Update Prescription and Reminder Dates to Current
-- Run this in Supabase SQL Editor to update sample data
-- ================================================

-- Update prescription dates to be current (starting today, ending in 6-12 months)
UPDATE prescriptions
SET
    start_date = CURRENT_DATE - INTERVAL '3 months',
    end_date = CURRENT_DATE + INTERVAL '6 months'
WHERE prescription_id = 1;

UPDATE prescriptions
SET
    start_date = CURRENT_DATE - INTERVAL '2 months',
    end_date = CURRENT_DATE + INTERVAL '9 months'
WHERE prescription_id = 2;

UPDATE prescriptions
SET
    start_date = CURRENT_DATE - INTERVAL '1 month',
    end_date = CURRENT_DATE + INTERVAL '8 months'
WHERE prescription_id = 3;

UPDATE prescriptions
SET
    start_date = CURRENT_DATE - INTERVAL '2 months',
    end_date = CURRENT_DATE + INTERVAL '10 months'
WHERE prescription_id = 4;

-- Delete old reminders
DELETE FROM reminders;

-- Insert new reminders for today
INSERT INTO reminders (user_id, prescription_id, reminder_datetime, status, notes) VALUES
-- Anna Hansen (user 1) - Lisinopril and Aspirin
(1, 1, CURRENT_DATE + TIME '08:00:00', 'Pending', 'Morning medication - Lisinopril'),
(1, 1, CURRENT_DATE + TIME '08:00:00' + INTERVAL '1 day', 'Pending', 'Morning medication - Lisinopril'),
(1, 2, CURRENT_DATE + TIME '12:00:00', 'Pending', 'Afternoon medication - Aspirin'),
(1, 2, CURRENT_DATE + TIME '12:00:00' + INTERVAL '1 day', 'Pending', 'Afternoon medication - Aspirin'),

-- Per Olsen (user 2) - Metformin (twice daily)
(2, 3, CURRENT_DATE + TIME '08:00:00', 'Pending', 'Breakfast medication - Metformin'),
(2, 3, CURRENT_DATE + TIME '19:00:00', 'Pending', 'Dinner medication - Metformin'),
(2, 3, CURRENT_DATE + TIME '08:00:00' + INTERVAL '1 day', 'Pending', 'Breakfast medication - Metformin'),
(2, 3, CURRENT_DATE + TIME '19:00:00' + INTERVAL '1 day', 'Pending', 'Dinner medication - Metformin'),

-- Kari Larsen (user 3) - Atorvastatin
(3, 4, CURRENT_DATE + TIME '21:00:00', 'Pending', 'Bedtime medication - Atorvastatin'),
(3, 4, CURRENT_DATE + TIME '21:00:00' + INTERVAL '1 day', 'Pending', 'Bedtime medication - Atorvastatin')
ON CONFLICT DO NOTHING;

-- Verify the updates
SELECT
    u.first_name || ' ' || u.last_name as patient_name,
    m.name as medicine,
    p.start_date,
    p.end_date,
    CASE
        WHEN p.end_date IS NULL OR p.end_date >= CURRENT_DATE
        THEN 'Active'
        ELSE 'Expired'
    END as status
FROM prescriptions p
JOIN users u ON p.user_id = u.user_id
JOIN medicines m ON p.medicine_id = m.medicine_id
ORDER BY u.user_id, p.prescription_id;
