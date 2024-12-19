import mongoose from "mongoose";
import { BlogsModel } from "../../../models/Blogs.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetBlogs = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get all blogs with pagination and sorting by date added in descending order"

    const { page = 1, limit = 6 } = req.query;

    try {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const totalItems = await BlogsModel.countDocuments();

        const totalPages = Math.ceil(totalItems / limitNumber);

        const blogs = await BlogsModel.find().sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate("category");

        return res.status(200).json(new apiResponse(200, {
            blogs,
            currentPage: pageNumber,
            totalPages,
            totalItems,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        }, "Blogs Retrieved Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
};

export const GetBlog = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get a single blog by id with related blogs in the same category"

    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
        return next(new apiError(400, "Blog id not provided or invalid"));
    }

    try {
        const blog = await BlogsModel.findById(id);
        if (!blog) {
            return next(new apiError(404, "Blog not found"));
        }

        const relatedBlogs = await BlogsModel.find({
            // category: blog.category,
            _id: { $ne: id },
        }).select("title subtitle added_on thumbnail").sort({ createdAt: -1 }).limit(6);

        return res.status(200).json(
            new apiResponse(200, { blog, relatedBlogs }, "Blog fetched successfully")
        );
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error.message}`));
    }
};