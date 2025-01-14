import { EstimateRevenueModel } from "../../../models/EstimateRevenue.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddRevenueDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = 'AUTHORIZED Admin can setup the estimated revenue for different areas and beds.'
    // #swagger.description = '> #TODO: NEEDS TO WORK ON ENDPOINT AS PER CALCULATIONS AND REQUIREMENTS.'

    const { area_name, base_price, beds, furnishing } = req.body;

    if (!area_name || !base_price || !Array.isArray(beds) || !Array.isArray(furnishing)) {
        return next(new apiError(400, "Incomplete Parameters"));
    }

    try {
        const revenue = await EstimateRevenueModel.create({ area_name, base_price, beds, furnishing });
        return res.status(200).json(new apiResponse(200, revenue, "Revenue created successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}