import express from "express";
import * as ibuController from "../controllers/ibuController.js";
import { ibuQuestionValidationRules } from '../validations/IbuValidation.js';
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/get-publish-question", ibuController.publishContent);
router.post(
  '/add-question',
  ibuQuestionValidationRules,  
  validate,       
  ibuController.AddIbuQuestions             
);

router.get("/your-question",ibuController.getUserQuestion);

export default router;

