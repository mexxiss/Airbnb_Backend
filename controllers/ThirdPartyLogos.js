import { ThirdPartyLogoModel } from "../models/ThirdPartyLogos.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetVideoGuides = async (req, res, next) => {
    try {
        const guides = await ThirdPartyLogoModel.find();
        return res.status(200).json(new apiResponse(200, guides, "Logos Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const AddVideoGuide = async(req, res, next) => {
    const {logo, name, type} = req.body;

    try {
        const guide = await ThirdPartyLogoModel.create({logo, name, type});
        return res.status(200).json(new apiResponse(200, guide, "Logos Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}