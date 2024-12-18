import { PricingModel } from "../../../models/Pricing.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddPricing = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add Pricing to be retrieved on Pricings Page on frontend"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PricingsRequest" }  
            }
          }
      } 
    */
    const {title, description, figures, icon, offers} = req.body;

    if(!title || !description || !figures || !icon || !offers || !Array.isArray(offers)) {
        return next(new apiError(400, "Incomplete information"));
    }

    try {
        const pricing = await PricingModel.create({title, description, figures, icon, offers});
        return res.status(200).json(new apiResponse(200, pricing, "Pricing added successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const DeletePricing = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can delete Pricing by specifying ID within request parameters"
    // #swagger.description = "> #TODO: Deleted document is being sent back through response that may be unnecessary",

    const {id} = req.params;

    if (!id) {
        return next(new apiError(400, "No Pricing Document Selected"));
    }

    try {
        const pricing = await PricingModel.deleteOne({_id: id});
        return res.status(200).json(new apiResponse(200, pricing, "Pricing deleted successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const UpdatePricing = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can update Pricing to be retrieved on Pricings Page on frontend by specifying ID witin params."
    // #swagger.description = "> #TODO: Updated document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatesRequest" }  
            }
          }
      } 
    */
    const {id} = req.params;
    const {updates} = req.body;

    if (!id) {
        return next(new apiError(400, "No Pricing Document Selected"));
    }

    try {
        const pricing = await PricingModel.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: false });
        return res.status(200).json(new apiResponse(200, pricing, "Pricing deleted successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}