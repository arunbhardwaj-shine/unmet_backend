import { errorResponse } from "../helpers/responseHelper.js";

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  // Custom error status or fallback 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, message, statusCode, {
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
