import express from "express";
import { addUserDetails } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddelware.js";
import { addUserValidation } from "../validations/commonValidation.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/add-user-details",
  authenticateToken,
  addUserValidation,
  validate,
  addUserDetails
);

export default router;
