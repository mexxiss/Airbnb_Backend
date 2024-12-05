import { BlogsModel } from "../models/Blogs.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetBlogs = async (req, res, next) => {
    try {
        const blogs = await BlogsModel.find();
        return res.status(200).json(new apiResponse(200, blogs, "Blogs Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const AddBlogs = async(req, res, next) => {
    const {title, subtitle, body, tags, added_on, category, thumbnail} = req.body;

    try {
        const blog = await BlogsModel.create({title, subtitle, body, tags, added_on, category, thumbnail});
        return res.status(200).json(new apiResponse(200, blog, "Blog Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}