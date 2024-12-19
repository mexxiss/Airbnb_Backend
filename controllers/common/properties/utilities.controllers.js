import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { PropertyUtilitiesModel } from "../../../models/PropertyUtilities.js";
import mongoose from "mongoose";

export const SetPropertyUtility = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Set Property Utility for a Property by User"
  // #swagger.description = "Created document may contain unnecessary fields."
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: "#/components/schema/PropertyUtilityRequest" }
        }
      }
    }
  */
  const user_id = req?.user?.id;
  const {
    name,
    provider_name,
    account_no,
    paid_by,
    web_login,
    web_pass,
    link,
    uploads,
    property,
    already_have_account,
  } = req.body;

  if (!property || !mongoose.isValidObjectId(property)) {
    return next(new apiError(400, `Property Id is required`));
  }

  try {
    const utilities = await PropertyUtilitiesModel.create({
      name,
      provider_name,
      account_no,
      paid_by,
      web_login,
      web_pass,
      link,
      uploads,
      property,
      already_have_account,
      user: user_id,
    });
    return res
      .status(200)
      .json(
        new apiResponse(200, utilities, "Property Utility Created Successfully")
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const GetPropertyUtilities = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Get Property Utility for a Property"
  // #swagger.description = "Retrieved document may contain unnecessary fields."

  const { property } = req.query;
  const user_id = req?.user?.id;

  if (!user_id) {
    return next(new apiError(400, `User required`));
  }

  if (!property) {
    return next(new apiError(400, `Query or Param not received for Property`));
  }

  try {
    const utilities = await PropertyUtilitiesModel.find({ property });
    return res.status(200).json({ utilities });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const UpdatePropertyUtility = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Update Property Utility for a Property by property ID through query or params"
  // #swagger.description = "Retrieved document may contain unnecessary fields."
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: "#/components/schema/UpdatesRequest" }
        }
      }
    }
  */
  const { id } = req.params || req.query; // Property ID
  const user_id = req._id; // Authenticated user ID
  const { updates } = req.body; // Utilities to update or create

  if (!updates || !user_id) {
    return next(new apiError(400, "Missing required fields"));
  }

  try {
    // Validate updates array
    if (!Array.isArray(updates) || updates.length === 0) {
      return next(new apiError(400, "Updates should be a non-empty array"));
    }

    const results = await Promise.all(
      updates.map(async (utility) => {
        const { name, ...otherFields } = utility;

        const existingUtility = await PropertyUtilitiesModel.findOne({
          property: id,
          name,
        });

        if (existingUtility) {
          return await PropertyUtilitiesModel.findByIdAndUpdate(
            existingUtility._id,
            { $set: { ...otherFields } },
            { new: true, runValidators: true }
          );
        } else {
          return await PropertyUtilitiesModel.create({
            name,
            ...otherFields,
            property: id,
            user_id,
          });
        }
      })
    );

    return res.status(200).json({
      message: "Utilities successfully updated or created",
      results,
    });
  } catch (error) {
    console.error(`Error updating utilities: ${error.message}`);
    return next(new apiError(500, "Server Error"));
  }
};
