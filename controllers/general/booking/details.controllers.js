import { BookDetailsModel } from "../../../models/BookDetails.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetBookDetails = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Save booking details to the database"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may contain unnecessary information",
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/BookDetailsRequest" }  
                }
            }
        }
    */
    const { first_name, last_name, email, guests, phone_number, message, promo_code, newsletter_agree, property, booked_dates } = req.body;
    try {
        const details = await BookDetailsModel.create({ first_name, last_name, email, guests, phone_number, message, promo_code, newsletter_agree, property, booked_dates });
        return res.status(200).json(new apiResponse(200, details, "Booking Details saved successfully."));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}