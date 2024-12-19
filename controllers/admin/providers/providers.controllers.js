import { ProvidersModel } from "../../../models/ServiceProviders.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetProviders = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can set or manage the list of providers for different services - electricity, internet, gas, chiller, etc."
    // #swagger.description = "> #TODO: On successful creation, no data is being sent from reponse",
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ProvidersRequest" }  
                }
            }
        } 
    */
    const {internet, electricity_water, gas, chiller, other} = req.body;
    
    if(!internet || !electricity_water || !gas || !chiller || !other) {
        return next(new apiError(400, "Providers incomplete"));
    }

    try {
        const result = await ProvidersModel.create({internet, electricity_water, gas, chiller, other});
        return res.status(200).json(new apiResponse(200, [], "Providers added successfully"))
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}
