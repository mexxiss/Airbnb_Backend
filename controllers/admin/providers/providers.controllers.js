import { ProvidersModel } from "../../../models/ServiceProviders.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetProviders = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const {internet, electricity_water, gas, chiller, other} = req.body;
    
    if(!internet || !electricity_water || !gas || !chiller || !other) {
        return next(new apiError(400, "Providers incomplete"));
    }

    try {
        const result = await ProvidersModel.create({internet, electricity_water, gas, chiller, other});
        return res.status(200).json(new apiResponse(200, result, "Providers added successfully"))
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}