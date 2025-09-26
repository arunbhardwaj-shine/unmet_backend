import { errorResponse, successResponse } from "../helpers/responseHelper.js";

export const addUserDetails = (req, res, next) => {
  try{
    const { role, region, country } = req.body;
    return successResponse(res, "Login successful", { });
  }catch(err){
    next(err);
  }
};