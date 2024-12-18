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

export const UpsertBankDetailsById = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Create or update bank details for a specific user by user ID'
  /*
  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    description: 'The ID of the user whose bank details need to be created or updated',
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
  const bankDetails = req?.body;

  if (!user_id) {
    return next(new apiError(400, `User ID is required`));
  }

  try {
    // Check if bank details already exist for the user
    let existingDetails = await PaymentDetailsModel.findOne({ user: user_id });

    if (existingDetails) {
      // If bank details exist, update them
      existingDetails = await PaymentDetailsModel.findOneAndUpdate(
        { user: user_id },
        bankDetails,
        { new: true, runValidators: true } // Return updated document and validate inputs
      );

      return res.status(200).json({
        message: "Bank details updated successfully",
        data: existingDetails,
      });
    } else {
      // If no bank details exist, create a new entry
      const newDetails = await PaymentDetailsModel.create({
        user: user_id,
        ...bankDetails,
      });

      return res.status(201).json({
        message: "Bank details created successfully",
        data: newDetails,
      });
    }
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};
