import express from "express";
import { getAgeDiagnosis, getNarrativeData, getContent, addRating, getFavouriteContent, addDownloadStats } from "../controllers/contentController.js";
import { authenticateToken } from "../middleware/authMiddelware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { addDownloadValidation, addRatingValidation } from "../validations/commonValidation.js";

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

router.get(
  "/get-content",
  authenticateToken,
  validate,
  getContent
);

router.post(
  "/toggle-rating",
  authenticateToken,
  addRatingValidation,
  validate,
  addRating
);

router.get(
  "/get-favourite-content",
  authenticateToken,
  validate,
  getFavouriteContent
);

router.post(
  "/content-download",
  authenticateToken,
  addDownloadValidation,
  validate,
  addDownloadStats
);

export default router;
