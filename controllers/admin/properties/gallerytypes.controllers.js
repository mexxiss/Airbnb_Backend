import { GallaryTypesModel } from "../../../models/GallaryTypes.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetGallaryType = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add any new gallary type by specifying the NAME of gallary type."
    // #swagger.description = "> #TODO: Created document is being sent from reponse that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { name: "gallary type" }  
            }
          }
      } 
    */
    const { name } = req.body;

    if (!name) {
        return next(new apiError(400, "Name is Required"));
    }

    try {
        const gallaryType = await GallaryTypesModel.create({ name });
        return res.status(200).json(new apiResponse(200, gallaryType, "GallaryType Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteGallaryType = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can delete any non-required gallary type by specifying the ID of gallary type in path."

    const { id } = req.params;

    try {
        const g_type = await GallaryTypesModel.deleteOne({ _id: id });
        return res.status(200).json(new apiResponse(200, [], "Deleted"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}