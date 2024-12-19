import { BookDetailsModel } from "../../../models/BookDetails.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetBookDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can get specific booking details by ID of the booking"
    // #swagger.description = "> #TODO: Retrieved document is being sent back through response that may contain unnecessary information",

    const { id } = req.params;

    try {
        const details = await BookDetailsModel.findById(id).populate("property").populate("booked_dates");
        return res.status(200).json(new apiResponse(200, details, "Book Details Data found"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}