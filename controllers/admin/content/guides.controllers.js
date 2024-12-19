import { VideoGuidesModel } from "../../../models/VideoGuides.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddVideoGuide = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add Videos media as guides to be retrieved on MEDIA page on frontend"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VideoGuidesRequest" }  
            }
          }
      } 
    */
    const { video_url, title, thumbnail } = req.body;

    try {
        const guide = await VideoGuidesModel.create({ video_url, title, thumbnail });
        return res.status(200).json(new apiResponse(200, guide, "Guide Added Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}