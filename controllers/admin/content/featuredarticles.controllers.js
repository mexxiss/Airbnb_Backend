import mongoose from "mongoose";
import { MediaFeaturedArticlesModel } from "../../../models/MediaFeaturedArticles.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddFeaturedArticles = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const {third_party, headline, link, added_on} = req.body;

    if (!third_party || !mongoose.isValidObjectId(third_party)) 
        return next(new apiError(400, "Third Party Info not provided"))

    try {
        const article = await MediaFeaturedArticlesModel.create({third_party, headline, link, added_on});
        return res.status(200).json(new apiResponse(200, article, "Articles Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}