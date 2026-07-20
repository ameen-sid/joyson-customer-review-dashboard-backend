import db from '../database/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json({
                success: false,
                message: 'User ID and password are required'
            });
        }

        const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (users.length > 0) {

            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {

                const token = jwt.sign(
                    { id: user.id, user_id: user.user_id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '8h' }
                );

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                    maxAge: 8 * 60 * 60 * 1000
                });

                res.json({
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        user_id: user.user_id,
                        role: user.role
                    }
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
};