import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import connectDB from './db/config.js';
connectDB();
dotenv.config();
const app = express();
app.use(express.json({ extended: false }));
    
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/institute", instituteRoutes);
app.use("/api/v1/room", roomRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server is Running on', PORT));