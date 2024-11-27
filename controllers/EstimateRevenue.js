import { EstimateRevenueModel } from "../models/EstimateRevenue.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const AddRevenueDetails = async (req, res, next) => {
    const {area, beds} = req.body;

    if (!area || !Array.isArray(beds)) {
        return next(new apiError(400, "Incomplete Parameters"));
    }

    try {
        const revenue = EstimateRevenueModel.create({area, beds});
        return res.status(200).json(new apiResponse(200, revenue, "Revenue created successfully"));
    } catch ( error ) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}