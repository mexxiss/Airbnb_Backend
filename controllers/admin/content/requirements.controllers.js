import { RequirementsModel } from "../../../models/Requirements.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddRequirements = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add Requirements to be retrieved on Requirements Page on frontend"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RequirementsRequest" }  
            }
          }
      } 
    */
    const { head, points } = req.body;

    if ( !head || !points || !Array.isArray(points) ) {
        return next(new apiError(400, "Incomplete Data Provided"))
    }

    try {
        const requirement = await RequirementsModel.create({head, points});
        return res.status(200).json(new apiResponse(200, requirement, "Requirement Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}