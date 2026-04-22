import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

promisePool.getConnection()
    .then(async (connection) => {
        console.log('Successfully connected to the database.');

        try {
            await connection.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(20) DEFAULT 'admin', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            await connection.query(`CREATE TABLE IF NOT EXISTS operator_trainings (id INT AUTO_INCREMENT PRIMARY KEY, month_year VARCHAR(50), plan_joined INT, operator_trained INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            await connection.query(`CREATE TABLE IF NOT EXISTS trainings_plan_actual (id INT AUTO_INCREMENT PRIMARY KEY, month_year VARCHAR(50), training_plan_regular INT, actual INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            await connection.query(`CREATE TABLE IF NOT EXISTS msil_defects (id INT AUTO_INCREMENT PRIMARY KEY, month_year VARCHAR(50), overall_defect_customer INT, ctq_defect_customer INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            await connection.query(`CREATE TABLE IF NOT EXISTS internal_rejections (id INT AUTO_INCREMENT PRIMARY KEY, month_year VARCHAR(50), overall_defect_internal INT, ctq_defect_internal INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            await connection.query(`CREATE TABLE IF NOT EXISTS trainings_plan_actual_bottom (id INT AUTO_INCREMENT PRIMARY KEY, month_year VARCHAR(50), training_plan INT, training_done INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            console.log('Data tables verified/created successfully.');
        } catch (tableErr) {
            console.error('Error creating tables:', tableErr.message);
        }

        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.message);
    });

export default promisePool;