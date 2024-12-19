import mongoose from "mongoose";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const getPropertyListByAdmin = async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can view the list of properties with a LIMIT of properties on each PAGE"
  // #swagger.description = "> #TODO: Each document of properties may contain unnecessary data that may not be required on admin panel",

  const { page = 1, limit = 10 } = req.query;
  try {
    const properties = await PropertiesModel.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProperties = await PropertiesModel.countDocuments({});
    res.status(200).json({
      data: properties,
      currentPage: page,
      totalPages: Math.ceil(totalProperties / limit),
      totalProperties,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
};

export const SetProperty = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can add new property"
  // #swagger.description = "> #TODO: Created document is being sent back through reponse that may be unnecessary",
  /* #swagger.requestBody = {
      required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PropertiesRequest" }  
          }
        }
    } 
  */
  const {
    title,
    description,
    property_images,
    property_details,
    address,
    discounts_percentage,
    costs,
    property_check_details,
    staying_rules,
    cancellation_policy,
    amenities,
    important_information,
  } = req.body;

  try {
    const property = await PropertiesModel.create({
      title,
      description,
      property_images,
      property_details,
      address,
      discounts_percentage,
      costs,
      property_check_details,
      cancellation_policy,
      amenities,
      important_information,
    });
    await property?.addStayingRules(staying_rules);
    return res
      .status(200)
      .json(new apiResponse(200, property, "Property created successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const DeleteProperty = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can delete any non-required property by specifying the ID within params"
  // #swagger.description = "> #TODO: Deleted document is being sent back through response that may be unnecessary",

  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id)) {
    return next(new apiError(400, "Document ID required"));
  }

  try {
    const property = await PropertiesModel.deleteOne({ _id: id });
    return res
      .status(200)
      .json(new apiResponse(200, property, "Property deleted successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const UpdateProperty = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can update any non-required property by specifying the ID within params"
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
  const { id } = req.params;
  const { updates } = req.body;

  if (!id) {
    return next(new apiError(400, "Document ID required"));
  }

  try {
    const property = await PropertiesModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(new apiResponse(200, property, "Property Updated Successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const GetUserProperties = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can view properties of any selected user by specifying id of the user as USER within params"
  // #swagger.description = "> #TODO: Each document of properties list may have unnecessary data being sent back to client",

  const user = req.params.user;

  try {
    const properties = await PropertiesModel.find({ user });
    const propertiesCounts = await PropertiesModel.countDocuments({ user });
    return res.status(200).json({ properties, totalCount: propertiesCounts });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
