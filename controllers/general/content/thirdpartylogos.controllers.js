import { ThirdPartyLogoModel } from "../../../models/ThirdPartyLogos.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetThirdPartyLogos = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get all third party logos for mapping on website's UI - Component"
    try {
        const guides = await ThirdPartyLogoModel.find();
        return res.status(200).json(new apiResponse(200, guides, "Logos Retrieved Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}
