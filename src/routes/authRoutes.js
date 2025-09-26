import express from "express";
import { checkToken } from "../controllers/authController.js";
import { checktokenValidation } from "../validations/authValidation.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/check-token",checktokenValidation,validate, checkToken);

export default router;
