import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import * as userModel from "../models/ibuModel.js";

export const publishContent = async (req, res) => {
    try {
        const questions = await userModel.publishQuestions(req.authId);
        return successResponse(
            res,
            "Questions fetched successfully",
            questions,
            200
        );
    } catch (error) {
        return errorResponse(
            res,
            error.message || "Failed to fetch questions",
            400
        );
    }
};

export const AddIbuQuestions = async (req, res) => {
    try {
        const result = await userModel.AddIbuQuestionsModel(req);
         console.log("result",result)
        return successResponse(res, result.message, result.data, 201);
    } catch (error) {

        if (
            error.message === 'userId is required' ||
            error.message === 'question is required'
        ) {
            return errorResponse(res, error.message, 400);
        }

        return errorResponse(res, "Something went wrong", 500);
    }
};




