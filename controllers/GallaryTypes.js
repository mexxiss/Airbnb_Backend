import { GallaryTypesModel } from "../models/GallaryTypes.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const SetGallaryType = async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new apiError(400, "Name is Required"));
    }

    try {
        const gallaryType = await GallaryTypesModel.create({ name });
        return res.status(200).json(new apiResponse(200, gallaryType, "GallaryType Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetGallaryTypes = async (req, res, next) => {
    try {
        const gallaryTypes = await GallaryTypesModel.find().sort({name: 1});
        return res.status(200).json(new apiResponse(200, gallaryTypes, "Gallary Types Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}