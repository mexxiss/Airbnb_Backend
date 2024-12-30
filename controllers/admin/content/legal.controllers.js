import { LegalModel } from "../../../models/Legal.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddLegal = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add Legals to be retrieved on Terms & Conditions/Privacy Policy/Refund Policy on frontend"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
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

    try {
        const legal = await LegalModel.create({ title, body, type });
        return res.status(200).json(new apiResponse(200, legal, "Guide Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}