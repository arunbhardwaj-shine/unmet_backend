import { body } from "express-validator";

export const addUserValidation = [
    body("role").notEmpty().withMessage("Role is required"),
    body("region").notEmpty().withMessage("Region is required"),
    body("country").notEmpty().withMessage("Country is required"),
];