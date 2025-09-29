import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { getNarrativeCategoriesAndAgeGroups, getNarrativeDataResult } from "../models/narrativeModel.js";
import { getArticleContent } from "../models/PdfModel.js";
import { addRatingInfo } from "../models/PdfActionModel.js";
import { getLocalIPs } from "../helpers/requestHelper.js";


export const getAgeDiagnosis = async(req, res, next) => {
  try{
    const result = await getNarrativeCategoriesAndAgeGroups();
    if(result?.tags.length > 0){
      result.tags = result?.tags?.map((item) => item.product)
    }
    let response = {
        categories: result?.categories,
        ageGroups: result?.ageGroups,
        tags: result?.tags
    }
    return successResponse(res, "Data get successfully", response);
  }catch(err){
    next(err);
  }
};

export const getNarrativeData = async(req, res, next) => {
  try{
    const result = await getNarrativeDataResult();
    return successResponse(res, "Data get successfully", result);
  }catch(err){
    next(err);
  }
};

export const getContent = async(req, res, next) => {
  try{
    const result = await getArticleContent();
    return successResponse(res, "Data get successfully", result);
  }catch(err){
    next(err);
  }
};

export const addRating = async(req, res, next) => {
  try{
    const pdf_id = req?.body?.pdf_id;
    const getIp  = getLocalIPs(req);
    let insertObj = {
      user_id: req?.authId,
      pdf_id: pdf_id,
      action_status: 4,
      ip_address: getIp,
    }
    const result = await addRatingInfo(insertObj);
    return successResponse(res, "Data get successfully", result);
  }catch(err){
    next(err);
  }
};