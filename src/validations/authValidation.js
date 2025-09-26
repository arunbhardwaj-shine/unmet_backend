import { body } from "express-validator";

export const checktokenValidation = [
    body("token").notEmpty().withMessage("Token is required"),
    body("idToken").notEmpty().withMessage("Id Token is required"),
];