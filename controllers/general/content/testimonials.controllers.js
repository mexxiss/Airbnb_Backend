import { TestimonialsModel } from "../../../models/Testimonials.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetTestimonials = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get all testimonials for mapping on website's UI - Testimonials carousel on Home Page"
    try {
        const testimonials = await TestimonialsModel.find();
        return res.status(200).json(new apiResponse(200, testimonials, "Testimonials retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}
