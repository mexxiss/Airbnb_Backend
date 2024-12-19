import { SubscriptionsModel } from "../../../models/Subscriptions.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetSubscriptions = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can see the list of subscriptions or subscribers"
    // #swagger.description = "> #TODO: Revise the response to selectively send required keys",

    try {
        const doc = await SubscriptionsModel.find();
        return res.status(200).json(new apiResponse(200, doc, "Subscriptions retrieved successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteSubscription = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can delete subscriptions or subscribers"

    const {id} = req.params
    try {
        const doc = await SubscriptionsModel.findByIdAndDelete(id);
        return res.status(200).json(new apiResponse(200, [], "Subscriptions deleted successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}