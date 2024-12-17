import { RequirementsModel } from "../../../models/Requirements.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetRequirements = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const requirements = await RequirementsModel.find();
        return res.status(200).json(new apiResponse(200, requirements, "Requirements Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}