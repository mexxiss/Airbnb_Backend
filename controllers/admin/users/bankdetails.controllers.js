import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { PaymentDetailsModel } from "../../../models/PaymentDetails.js";

export const GetUserPaymentDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const user_id = req.params;

    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    try {
        const docs = await PaymentDetailsModel.find({user: user_id}).limit(1);
        return res.status(200).json(docs[0]);
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}