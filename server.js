import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import examRoutes from './routes/examRoutes.js';
// import testRoutes from './routes/testRoutes.js';
import connectDB from './db/config.js';
import swaggerSetup from './swagger.js';
connectDB();
dotenv.config();
const app = express();
app.use(express.json({ extended: false }));
    
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/institute", instituteRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/exam", examRoutes);
// app.use("/api/v1/test", testRoutes);

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
// Swagger setup
swaggerSetup(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server is Running on', `http://localhost:${PORT}`));