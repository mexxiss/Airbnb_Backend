import { SubscriptionsModel } from "../../../models/Subscriptions.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetSubscription = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Set Subscription for Newsletter'
    const {email} = req.body;

    if (!email) return next(new apiError(400, "Email is required"));

    try {
        const doc = await SubscriptionsModel.create({email});
        return res.status(200).json(new apiResponse(200, doc, "Subscribed successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}
