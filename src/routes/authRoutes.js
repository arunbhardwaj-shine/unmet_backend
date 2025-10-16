import express from "express";
import { checkToken, login, refreshToken } from "../controllers/authController.js";
import { checktokenValidation } from "../validations/authValidation.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/check-token",checktokenValidation,validate, checkToken);
router.post("/refresh-token", refreshToken);
router.post("/login", login);

export default router;
