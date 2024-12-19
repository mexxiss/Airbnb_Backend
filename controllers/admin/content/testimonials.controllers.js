import { TestimonialsModel } from "../../../models/Testimonials.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetTestimonials = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add testimonials to be retrieved on frontend"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TestimonialsRequest" }  
            }
          }
      } 
    */
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