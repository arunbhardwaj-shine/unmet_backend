import { errorResponse, successResponse } from "../helpers/responseHelper.js";

export const addUserDetails = (req, res) => {
  res.json({ message: "User profile", user: req.user });
};