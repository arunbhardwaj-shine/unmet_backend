import { body } from "express-validator";

export const addUserValidation = [
    body("role").notEmpty().withMessage("Role is required"),
    body("region").notEmpty().withMessage("Region is required"),
    body("country").notEmpty().withMessage("Country is required"),
];

export const addRatingValidation = [
    body("pdf_id").notEmpty().withMessage("Pdf id is required"),
];

export const addDownloadValidation = [
    body("pdf_id").notEmpty().withMessage("Pdf id is required"),
];
