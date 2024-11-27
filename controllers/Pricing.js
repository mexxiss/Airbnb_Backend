import { PricingModel } from "../models/Pricing.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const GetPricings = async (req, res, next) => {
    try {
        const pricings = await PricingModel.find();
        return res.status(200).json(new apiResponse(200, pricings, "Pricings retrieved successfully"));
    } catch ( error ) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const AddPricing = async (req, res, next) => {
    const {title, figures, icon, offers} = req.body;

    if(!title || !figures || !icon || !offers || !Array.isArray(offers)) {
        return next(new apiError(400, "Incomplete information"));
    }

    try {
        const pricing = await PricingModel.create({title, figures, icon, offers});
        return res.status(200).json(new apiResponse(200, pricing, "Pricing added successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const DeletePricing = async (req, res, next) => {
    const {id} = req.params;

    if (!id) {
        return next(new apiError(400, "No Pricing Document Selected"));
    }

    try {
        const pricing = await PricingModel.deleteOne({_id: id});
        return res.status(200).json(new apiResponse(200, pricing, "Pricing deleted successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const UpdatePricing = async (req, res, next) => {
    const {id} = req.params;
    const {updates} = req.body;

    if (!id) {
        return next(new apiError(400, "No Pricing Document Selected"));
    }

    try {
        const pricing = await PricingModel.findById(id, { $set: updates }, { new: true, runValidators: false });
        return res.status(200).json(new apiResponse(200, pricing, "Pricing deleted successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}