import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { PaymentDetailsModel } from "../../../models/PaymentDetails.js";

export const GetUserPaymentDetails = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can fetch the bank details of specific user using the ID passed in params"
  
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
  // #swagger.summary = "AUTHORIZED Admin can update the bank details of specific user using the ID passed in params and the updated fields as an object - updates - in request body"
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdatesRequest"
          }  
        }
      }
    } 
  */

  const user_id = req?.params?.id;
  const updates = req?.body;

  if (!user_id) {
    return next(new apiError(400, `User ID is required`));
  }

  try {
    const updatedDetails = await PaymentDetailsModel.findOneAndUpdate(
      { user: user_id },
      updates,
      { new: true, runValidators: true } 
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
