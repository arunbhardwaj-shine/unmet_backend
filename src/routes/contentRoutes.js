import express from "express";
import { getAgeDiagnosis, getNarrativeData } from "../controllers/contentController.js";
import { authenticateToken } from "../middleware/authMiddelware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get(
  "/categories-age-groups",
  authenticateToken,
  validate,
  getAgeDiagnosis
);

router.get(
  "/get-narratives",
  authenticateToken,
  validate,
  getNarrativeData
);

export default router;
