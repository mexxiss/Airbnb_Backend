import { ThirdPartyLogoModel } from "../models/ThirdPartyLogos.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetThirdPartyLogos = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const guides = await ThirdPartyLogoModel.find();
        return res.status(200).json(new apiResponse(200, guides, "Logos Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const AddThirdPartyLogos = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const {logo, name, type} = req.body;

    try {
        const guide = await ThirdPartyLogoModel.create({logo, name, type});
        return res.status(200).json(new apiResponse(200, guide, "Logos Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const UpdateThirdPartyLogos = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const {id} = req.params;
    const {updates} = req.body;

    if(!id) {
        return next(new apiError(400, "Document ID not provided"));
    }

    try {
        const third_party = await ThirdPartyLogoModel.findByIdAndUpdate(id, {$set: updates}, {new: true, runValidators: true});
        return res.status(200).json(new apiResponse(200, third_party, "Logos Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}