import { TestimonialsModel } from "../models/Testimonials.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetTestimonials = async (req, res, next) => {
    try {
        const testimonials = await TestimonialsModel.find();
        return res.status(200).json(new apiResponse(200, testimonials, "Testimonials retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const SetTestimonials = async (req, res, next) => {
    const { comment, name, designation } = req.body;

    if(!comment || !name || !designation) {
        return next(new apiError(400, "Incomplete Information"))
    }

    try {
        const testimonial = await TestimonialsModel.create({comment, name, designation});
        return res.status(200).json(new apiResponse(200, testimonial, "Testimonial added successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}