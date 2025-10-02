import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRouter from "./routes/index.router.js";
import applicationRoutes from './routes/application.routes.js';
import jobRoutes from './routes/jobs.routes.js';
dotenv.config();

const port = process.env.PORT || 3000;
  
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use all API routes
app.use("/api", apiRouter);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes); 

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running at port ${port}`);
});
