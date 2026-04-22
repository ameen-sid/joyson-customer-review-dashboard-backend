import db from '../database/db.js';
import bcrypt from 'bcryptjs';

const initializeDatabase = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Users table verified/created.");

        await db.query('DELETE FROM users WHERE user_id = ?', ['admin123']);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await db.query('INSERT INTO users (user_id, password, role) VALUES (?, ?, ?)', ['admin123', hashedPassword, 'admin']);
        console.log("Admin user (admin123) verified with secure hashed password.");

        process.exit(0);
    } catch (err) {
        console.error("Database initialization failed:", err);
        process.exit(1);
    }
};

initializeDatabase();