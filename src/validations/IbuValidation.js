import { body } from 'express-validator';

export const ibuQuestionValidationRules = [
  body('question')
    .notEmpty()
    .withMessage('question is required'),
];
