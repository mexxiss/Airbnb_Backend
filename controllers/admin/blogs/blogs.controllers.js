import { BlogsModel } from "../../../models/Blogs.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddBlogs = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add new blogs to the website"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/BlogsRequest" }  
                }
            }
        }
    */
    const { title, subtitle, body, tags, added_on, category, thumbnail } = req.body;

    try {
        const blog = await BlogsModel.create({ title, subtitle, body, tags, added_on, category, thumbnail });
        return res.status(200).json(new apiResponse(200, blog, "Blog Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}