import mongoose from "mongoose";
import { MediaFeaturedArticlesModel } from "../../../models/MediaFeaturedArticles.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetFeaturedArticles = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const articles = await MediaFeaturedArticlesModel.find().populate("third_party");
        return res.status(200).json(new apiResponse(200, articles, "Articles Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}