import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { getNarrativeCategoriesAndAgeGroups, getNarrativeDataResult } from "../models/narrativeModel.js";

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
    return successResponse(res, "Data get successfulyl", response);
  }catch(err){
    next(err);
  }
};

export const getNarrativeData = async(req, res, next) => {
  try{
    const result = await getNarrativeDataResult();
    return successResponse(res, "Data get successfulyl", result);
  }catch(err){
    next(err);
  }
};