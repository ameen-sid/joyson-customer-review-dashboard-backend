import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', dataRoutes);

app.get('/', (req, res) => {
  res.send('Backend Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});