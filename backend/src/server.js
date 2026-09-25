import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'TalentFlow ATS API Server is running',
    status: 'Online',
    version: '1.0.0'
  });
});

// TODO (Thành viên 2): Viết các API routes trong src/routes/api.js và mount vào app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`[Backend Server running on port ${PORT}]`);
});
