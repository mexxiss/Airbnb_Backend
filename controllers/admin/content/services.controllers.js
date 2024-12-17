import { ServicesModel } from "../../../models/Services.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetService = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const {name} = req.body;
    if(!name) {
        return next(new apiError(400, "Name not provided"));
    }

    try {
        const result = await ServicesModel.create({name});
        return res.status(200).json(new apiResponse(200, result,"Service added successfully"))
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}