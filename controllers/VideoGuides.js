import { VideoGuidesModel } from "../models/VideoGuides.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetVideoGuides = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const guides = await VideoGuidesModel.find();
        return res.status(200).json(new apiResponse(200, guides, "Guide Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const AddVideoGuide = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const {video_url, title, thumbnail} = req.body;

    try {
        const guide = await VideoGuidesModel.create({video_url, title, thumbnail});
        return res.status(200).json(new apiResponse(200, guide, "Guide Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}