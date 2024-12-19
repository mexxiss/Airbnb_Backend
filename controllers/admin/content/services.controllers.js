import { ServicesModel } from "../../../models/Services.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetService = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add any new Service to be retrieved on Services Dropdown tab in Navbar on frontend"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServicesRequest" }  
            }
          }
      } 
    */
    const {name} = req.body;
    if(!name) {
        return next(new apiError(400, "Name not provided"));
    }

    try {
        const result = await ServicesModel.create({name});
        return res.status(200).json(new apiResponse(200, result,"Service added successfully"))
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}