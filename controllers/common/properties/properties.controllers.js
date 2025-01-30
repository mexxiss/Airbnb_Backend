import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetAllPropertiesByUser = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Get All Properties by User ID through JWT Token",
  // #swagger.description = "Retrieved documents may contain unnecessary fields."

  const user_id = req?.user?.id;
  const { search_term } = req.query;

  if (!user_id) {
    return next(new apiError(400, "User required"));
  }

  const query = { user: user_id };
  if (search_term) {
    query.title = { $regex: search_term, $options: "i" };
  }

  try {
    const properties = await PropertiesModel.find(query)
      .populate("property_images")
      .select(
        "title description property_images property_details.rooms_count status"
      );
    return res
      .status(200)
      .json(
        new apiResponse(200, properties, "Property retrieved successfully")
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const GetFullPropertiesObjByUser = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Get All Properties by User ID through JWT Token",
  // #swagger.description = "Retrieved documents may contain unnecessary fields."

  const user_id = req?.user?.id;

  if (!user_id) {
    return next(new apiError(400, "User required"));
  }

  try {
    const properties = await PropertiesModel.find({ user: user_id }).populate(
      "property_images amenities"
    );
    return res
      .status(200)
      .json(
        new apiResponse(200, properties, "Property retrieved successfully")
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const SetBlockOwnerStay = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Set Block Owner Stay for Property",
  // #swagger.description = "User can set block owner stay for their property."

  const { id } = req.params;
  const { block_owner } = req.body;

  if (
    !block_owner ||
    typeof block_owner !== "object" ||
    Array.isArray(block_owner)
  ) {
    return res
      .status(400)
      .json(new apiResponse(400, "Block Owner Stay must be a valid object"));
  }

  try {
    const property = await PropertiesModel.findByIdAndUpdate(
      id,
      { block_owner },
      { new: true }
    );
    if (!property) {
      return res.status(404).send();
    }
    res.status(200).send("Updated successfully");
  } catch (e) {
    res.status(500).send(e);
  }
};

export const UpdatePropertyByUser = async (req, res, next) => {
  // #swagger.tags = ['Owner']
  // #swagger.summary = "AUTHORIZED Owner can update their own property, Admin can update any property"
  // #swagger.description = "Only the property owner or an admin can update the property details."
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UpdatesRequest" }  
        }
      }
    } 
  */
  const { id } = req.params;
  const { updates } = req.body;
  console.log({ updates });

  if (!id) {
    return next(new apiError(400, "Document ID required"));
  }

  try {
    const property = await PropertiesModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate({ path: "property_images", select: "img_url type" });

    return res
      .status(200)
      .json(new apiResponse(200, property, "Property Updated Successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
