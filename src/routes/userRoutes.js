import express from "express";
import { addUserDetails, getUserDetails } from "../controllers/userController.js";
import { addUserValidation } from "../validations/commonValidation.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/add-user-details",
  addUserValidation,
  validate,
  addUserDetails
);

router.get("/get-user-details",getUserDetails);


export default router;
