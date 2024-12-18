import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { PaymentDetailsModel } from "../../../models/PaymentDetails.js";

export const GetUserPaymentDetails = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  const user_id = req?.params?.id;

  if (!user_id) {
    return next(new apiError(400, `User required`));
  }

  try {
    const docs = await PaymentDetailsModel.find({ user: user_id }).limit(1);
    return res.status(200).json({ data: docs[0] });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const UpdateBankDetailsById = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Update bank details for a specific user by user ID'
  /*
#swagger.parameters['id'] = {
  in: 'path',
  required: true,
  description: 'The ID of the user whose bank details need to be updated',
  type: 'string'
}
#swagger.parameters['body'] = {
  in: 'body',
  required: true,
  schema: {
    accountHolderName: 'Updated Name',
    bankName: 'Updated Bank Name',
    currency: 'USD',
    iban: 'Updated IBAN',
    accountNumber: 'Updated Account Number',
    address: 'Updated Address'
  }
}
*/

  const user_id = req?.params?.id;
  const updates = req?.body;

  if (!user_id) {
    return next(new apiError(400, `User ID is required`));
  }

  try {
    // Find the bank details by user ID and update them
    const updatedDetails = await PaymentDetailsModel.findOneAndUpdate(
      { user: user_id },
      updates,
      { new: true, runValidators: true } // Return the updated document and validate the inputs
    );

    if (!updatedDetails) {
      return next(
        new apiError(404, `Bank details not found for user ID: ${user_id}`)
      );
    }

    return res.status(200).json({
      message: "Bank details updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};
