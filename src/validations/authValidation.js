import { body } from "express-validator";

export const checktokenValidation = [
    body("token").notEmpty().withMessage("Token is required"),
    body("idToken").notEmpty().withMessage("Id Token is required"),
];

export const loginValidation = [
    body("mail").notEmpty().withMessage("Mail is required"),
];