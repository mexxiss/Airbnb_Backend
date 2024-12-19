import { PricingModel } from "../../../models/Pricing.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetPricings = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get all pricings for mapping on website's UI - Pricings Page"
    try {
        const pricings = await PricingModel.find();
        return res.status(200).json(new apiResponse(200, pricings, "Pricings retrieved successfully"));
    } catch ( error ) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}
