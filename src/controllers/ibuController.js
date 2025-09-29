import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import * as userModel from "../models/ibuModel.js";

export const publishContent = async (req, res, next) => {
  try {
    const questions = await userModel.publishQuestions(req.authId);
    return successResponse(res, "Questions fetched successfully", questions, 200);
  } catch (err) {
    next(err);
  }
};


export const AddIbuQuestions = async (req, res, next) => {
    try {
        const data = await userModel.AddIbuQuestionsModel(req);

        return successResponse(res, 'Question added successfully', data, 201);
    } catch (err) {
        next(err);
    }
};





