import { LegalModel } from "../../../models/Legal.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddLegal = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can add or update Legals for Terms & Conditions/Privacy Policy/Refund Policy on frontend"
  // #swagger.description = "> Updates the document if the type exists, otherwise creates a new one."
  /* #swagger.requestBody = {
      required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LegalsRequest" }  
          }
        }
    } 
  */
  const { body, title, type } = req.body;

  if (!title || !body || !type) {
    return next(new apiError(400, "Title, body, and type are required"));
  }

  try {
    const legal = await LegalModel.findOneAndUpdate(
      { type },
      { title, body, type },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json(
        new apiResponse(200, legal, "Legal document section saved successfully")
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
