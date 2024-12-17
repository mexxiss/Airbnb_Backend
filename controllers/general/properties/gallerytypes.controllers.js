import { GallaryTypesModel } from "../../../models/GallaryTypes.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetGallaryTypes = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const gallaryTypes = await GallaryTypesModel.find().sort({name: 1});
        return res.status(200).json(new apiResponse(200, gallaryTypes, "Gallary Types Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}