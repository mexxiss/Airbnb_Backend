import { LegalModel } from "../../../models/Legal.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetLegals = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get all legals, Terms & Conditions, Privacy Policy, and Refund Policy, for mapping on website's UI"
    
    const { type } = req.query;

    try {
        const legals = await LegalModel.findOne({type});
        return res.status(200).json(new apiResponse(200, legals, "Guide Retrieved Successfully"))
    } catch (error) {
        console.log(error.message);
        
        return next(new apiError(500, `Server Error: ${error}`));
    }
}