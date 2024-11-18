import { ServicesModel } from "../models/Services.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const SetService = async (req, res, next) => {
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

export const GetServices = async (req, res, next) => {
    try {
        const services = await ServicesModel.find();
        return res.status(200).json(new apiResponse(200, services, "Services Retrieved Successfully"));
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}