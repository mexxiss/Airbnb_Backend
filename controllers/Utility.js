import { UtilityModel } from "../models/Utility.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

export const SetUtility = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const {vat_tax_rate, tourism_tax_rate} = req.body;

    try {
        const utility = UtilityModel.create({vat_tax_rate, tourism_tax_rate});
        return res.status(200).json(new apiResponse(200, utility, "Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}