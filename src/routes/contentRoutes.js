import express from "express";
import { getAgeDiagnosis, getNarrativeData, getContent, addRating, getFavouriteContent, addDownloadStats, shareContent, getRecentContent } from "../controllers/contentController.js";
import { validate } from "../middleware/validationMiddleware.js";
import { addDownloadValidation, addRatingValidation, shareContentValidation } from "../validations/commonValidation.js";

const router = express.Router();

router.get("/categories-age-groups",getAgeDiagnosis);

router.get("/get-narratives",getNarrativeData);

router.get("/get-content",getContent);

router.post(
  "/toggle-rating",
  addRatingValidation,
  validate,
  addRating
);

router.get("/get-favourite-content",getFavouriteContent);

router.get("/get-recent-content",getRecentContent);

router.post(
  "/content-download",
  addDownloadValidation,
  validate,
  addDownloadStats
);

router.post(
  "/content-share",
  shareContentValidation,
  validate,
  shareContent
);

export default router;
