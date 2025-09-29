import express from "express";
import * as ibuController from "../controllers/ibuController.js";
import { authenticateToken } from "../middleware/authMiddelware.js";
import { ibuQuestionValidationRules } from '../validations/IbuValidation.js';
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/get-publish-question", authenticateToken, ibuController.publishContent);
router.post(
  '/add-question',
  authenticateToken,
  ibuQuestionValidationRules,  
  validate,       
  ibuController.AddIbuQuestions             
);

router.get(
  "/your-question",
  authenticateToken,
  validate,
  ibuController.getUserQuestion
);

export default router;

