-- Check if tables exist and have data
SELECT name FROM sqlite_master WHERE type='table';

-- Check contact submissions
SELECT COUNT(*) as contact_count FROM contact_submissions;
SELECT * FROM contact_submissions LIMIT 5;

-- Check users
SELECT COUNT(*) as user_count FROM users;
SELECT * FROM users;

-- Check sessions
SELECT COUNT(*) as session_count FROM sessions;
