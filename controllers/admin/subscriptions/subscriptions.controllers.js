import { SubscriptionsModel } from "../../../models/Subscriptions.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetSubscriptions = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    try {
        const doc = await SubscriptionsModel.find();
        return res.status(200).json(new apiResponse(200, doc, "Subscriptions retrieved successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteSubscription = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const {id} = req.params
    try {
        const doc = await SubscriptionsModel.findByIdAndDelete(id);
        return res.status(200).json(new apiResponse(200, doc, "Subscriptions deleted successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}