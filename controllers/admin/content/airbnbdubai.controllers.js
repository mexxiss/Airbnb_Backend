import { apiResponse } from '../../../utils/apiResponse.js';
import { apiError } from '../../../utils/apiError.js';
import { DubaiModel } from '../../../models/Dubai.js';

export const SetDubaiDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add the content for AIRBNB DUBAI page"
    // #swagger.description = "> #TODO: Created document is being sent from reponse that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AirbnbDubaiRequest" }  
            }
          }
      } 
    */
    const { section1, section2, section3, section4, section5 } = req.body;

    if (!section1 || !section2 || !section3 || !section4 || !section5) {
        return next(new apiError(400, "Dubai information is incomplete"));
    }

    try {
        const details = await DubaiModel.create({ section1, section2, section3, section4, section5 });
        return res.status(200).json(new apiResponse(200, details, "Information added successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteDubaiDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can delete the content for AIRBNB DUBAI page by specifying its ID within path"
    // #swagger.description = "> #TODO: Deleted document is being sent from reponse that may be unnecessary",

    const { id } = req.params;

    if (!id) {
        return next(new apiError(400, "Dubai information is incomplete"))
    }

    try {
        const detail = await DubaiModel.deleteOne({ _id: id });
        return res.status(200).json(new apiResponse(200, detail, "Dubai Info deleted successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}