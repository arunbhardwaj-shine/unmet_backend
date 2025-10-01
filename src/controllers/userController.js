import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { getPdfs } from "../models/PdfModel.js";
import { createUnmetUser } from "../models/UnmetUsers.js";
import { getUsersProfileData } from "../models/UserModel.js";

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

export const getUserDetails = async(req, res, next) => {
  try{
    const pdfIds = await getPdfs();
    const checkUnmetUser = await getUsersProfileData(req?.authId, pdfIds);
    return successResponse(res, "User created successful", checkUnmetUser);
  }catch(err){
    next(err);
  }
};