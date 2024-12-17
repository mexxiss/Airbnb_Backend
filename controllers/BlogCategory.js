import { BlogCategoryModel } from "../models/BlogCategory.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetBlogCategories = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    try {
        const categories = await BlogCategoryModel.find();
        return res.status(200).json(new apiResponse(200, categories, "Blogs Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const AddBlogCategory = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const {name} = req.body;

    try {
        const category = await BlogCategoryModel.create({name});
        return res.status(200).json(new apiResponse(200, category, "Blog Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}