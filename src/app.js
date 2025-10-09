import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ContentRoutes from "./routes/contentRoutes.js";
import ibuRoutes from "./routes/ibuRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import { authenticateToken } from "./middleware/authMiddelware.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors(
  {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
));
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/auth")) {
    return next();
  }
  authenticateToken(req, res, next);
});

app.use("/api/users", userRoutes);
app.use("/api/content", ContentRoutes);
app.use("/api/questions", ibuRoutes);

// Not found route
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

export default app;

