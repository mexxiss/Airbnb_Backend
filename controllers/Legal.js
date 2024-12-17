import { LegalModel } from "../models/Legal.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetLegals = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const legals = await LegalModel.find();
        return res.status(200).json(new apiResponse(200, legals, "Guide Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const AddLegal = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const { body, title } = req.body;

    try {
        const legal = await LegalModel.create({title, body});
        return res.status(200).json(new apiResponse(200, legal, "Guide Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}