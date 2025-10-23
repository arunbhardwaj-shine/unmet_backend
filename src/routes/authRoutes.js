import express from "express";
import { checkToken, details, login, refreshToken } from "../controllers/authController.js";
import { checktokenValidation, loginValidation, userDetailValidation } from "../validations/authValidation.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/check-token",checktokenValidation,validate, checkToken);
router.post("/refresh-token", refreshToken);
router.post("/login",loginValidation,validate, login);
router.post("/details",userDetailValidation,validate, details);

export default router;
