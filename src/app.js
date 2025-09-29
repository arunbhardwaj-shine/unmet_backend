import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ContentRoutes from "./routes/contentRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/content", ContentRoutes);

// Not found route
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

export default app;

