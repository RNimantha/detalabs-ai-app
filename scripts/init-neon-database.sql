-- Create database and tables for detaLabsAI application on Neon

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name, role)
VALUES ('admin@detalabsai.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqu', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample contact submissions for testing
INSERT INTO contact_submissions (name, email, subject, message, status)
SELECT * FROM (VALUES
    ('John Doe', 'john@example.com', 'AI Consultation Request', 'I would like to discuss implementing AI solutions for my e-commerce business.', 'new'),
    ('Sarah Smith', 'sarah@company.com', 'Data Analytics Project', 'We need help with analyzing our customer data to improve retention rates.', 'in_progress'),
    ('Mike Johnson', 'mike@startup.com', 'ML Model Development', 'Looking for assistance in developing a recommendation system for our platform.', 'completed')
) AS v(name, email, subject, message, status)
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions LIMIT 1);
