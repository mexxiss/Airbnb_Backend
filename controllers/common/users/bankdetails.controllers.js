import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { PaymentDetailsModel } from "../../../models/PaymentDetails.js";

export const SetPaymentDetails = async(req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "AUTHENTICATED Owner or Admin can set Payment Details by passing ID through JWT Token"
    // #swagger.description = "> TODO: Created document is sent back that may be unnecessary."
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: { $ref: "#/components/schema/PaymentDetailsRequest" }
            }
        }
    }
    */
    const user_id = req?.user?.id;
    const {accountHolderName, accountNumber, bankName, swiftCode, iban, paymentMethod, currency, address} = req.body;
    
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    try {
        const paymentDetails = await PaymentDetailsModel.create({accountHolderName, accountNumber, bankName, swiftCode, iban, paymentMethod, user: user_id, currency, address});
        return res.status(200).json(new apiResponse(200, paymentDetails, "Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetPaymentDetails = async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "Get Payment Details by passing user ID through JWT Token"
    // #swagger.description = "> TODO: Retrieved details are sent back that may contain unnecessary information."

    const user_id = req?.user?.id;

    if (!user_id) {
        return next(new apiError(400, `User required`));
    }

    try {
        let docs = await PaymentDetailsModel.findOne({user: user_id});
        return res.status(200).json(docs);
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const UpdatePaymentDetails = async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "Update Payment Details by passing ID through params or query and user ID through JWT Token"
    // #swagger.description = "> TODO: Updated document is sent back that may be unnecessary."
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: { $ref: "#/components/schema/UpdatesRequest" }
            }
        }
    }
    */
    const { updates } = req.body;
    const { id } = req.params;
    const user_id = req?.user?.id;

    if (!updates) {
        return next(new apiError(400, `Payment Details Update required`));
    }

    try {
        const doc = await PaymentDetailsModel.findOne({ _id: id });

        if (!doc) {
            return next(new apiError(404, `Payment Details not found`));
        }

        if (user_id !== doc.user.toString()) {
            return next(new apiError(403, `Not Authorized to change details`));
        }

        doc.set(updates);
        await doc.save({ validateBeforeSave: true });

        return res.status(200).json({ data: doc });
    } catch (error) {
        console.error(`Error updating payment details: ${error.message}`);
        return next(new apiError(500, `Server Error`));
    }
};