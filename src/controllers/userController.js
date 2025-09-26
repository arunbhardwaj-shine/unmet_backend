import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { createUnmetUser } from "../models/UnmetUsers.js";

export const addUserDetails = async(req, res, next) => {
  try{
    const { role, region, country } = req.body;
    await createUnmetUser({
      user_id: req?.authId,
      role: role,
      region: region,
      country: country,
    });
    return successResponse(res, "User created successful", { });
  }catch(err){
    next(err);
  }
};