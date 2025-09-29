import express from "express";
import * as ibuController from "../controllers/ibuController.js";
import { authenticateToken } from "../middleware/authMiddelware.js";

const router = express.Router();

router.get("/get-publish-content",authenticateToken,ibuController.publishContent);
router.post('/add-ibu-question', authenticateToken,ibuController.AddIbuQuestions);

export default router;
