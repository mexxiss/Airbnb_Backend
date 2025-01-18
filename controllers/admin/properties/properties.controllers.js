import mongoose from "mongoose";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { GalleryModel } from "../../../models/Gallery.js";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const getPropertyListByAdmin = async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can view the list of properties with a LIMIT of properties on each PAGE"
  // #swagger.description = "> Each document of properties may contain unnecessary data that may not be required on the admin panel."

  const {
    startDate,
    endDate,
    status = "all",
    searchTerm = "",
    page = 1,
    limit = 10,
  } = req.query;

  const filterConditions = {};
  try {
    // Date range filtering
    if (startDate && endDate) {
      filterConditions.createdAt = {
        $gte: new Date(startDate), // greater than or equal to startDate
        $lte: new Date(endDate), // less than or equal to endDate
      };
    }

    // Status filtering
    if (status && status !== "all") {
      filterConditions.status = status;
    }

    // Search term filtering
    if (searchTerm) {
      filterConditions.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { "address.city": { $regex: searchTerm, $options: "i" } },
        { "address.area": { $regex: searchTerm, $options: "i" } },
        { "address.pincode": { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        {
          "property_details.furnishing": { $regex: searchTerm, $options: "i" },
        },
        { "property_details.wifi.name": { $regex: searchTerm, $options: "i" } },
        { "costs.currency": { $regex: searchTerm, $options: "i" } },
        {
          "important_information.about_space": {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          "important_information.guest_access": {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    // Fetch filtered properties
    const properties = await PropertiesModel.find(filterConditions)
      .populate({
        path: "property_images",
        select: "img_url type",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProperties = await PropertiesModel.countDocuments(
      filterConditions
    );

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
  // #swagger.description = "> Handles property creation and associated gallery updates."
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PropertiesRequest" }
          }
        }
  } */

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
    status,
    user,
  } = req.body;

  if (!title || !description || !address || !user) {
    return res
      .status(400)
      .json(
        new apiResponse(
          400,
          null,
          "Missing required fields: title, description, address, or user."
        )
      );
  }

  let createdProperty = null; // To store the created property for potential rollback

  try {
    // Step 1: Create the property document
    createdProperty = await PropertiesModel.create({
      title,
      description,
      property_images,
      property_details,
      address,
      discounts_percentage,
      costs,
      staying_rules,
      property_check_details,
      cancellation_policy,
      amenities,
      important_information,
      status,
      user,
    });

    await createdProperty.updateLocationFromAddress(GOOGLE_API_KEY);

    // Step 2: Update the gallery documents
    if (property_images && property_images.length > 0) {
      const objectIdImages = property_images.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const updatedGallery = await GalleryModel.updateMany(
        { _id: { $in: objectIdImages } },
        { $set: { property: createdProperty._id } }
      );

      if (updatedGallery.modifiedCount === 0) {
        throw new Error(
          "No gallery documents were updated. Rolling back property creation."
        );
      }
    }

    return res
      .status(201)
      .json(
        new apiResponse(201, createdProperty, "Property created successfully")
      );
  } catch (error) {
    console.error("Error during property creation:", error);

    // Cleanup: Rollback created property if an error occurs
    if (createdProperty) {
      try {
        await PropertiesModel.findByIdAndDelete(createdProperty._id);
      } catch (cleanupError) {
        console.error(
          "Error during rollback of property creation:",
          cleanupError
        );
      }
    }

    return next(
      new apiError(500, "An error occurred while creating the property.")
    );
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
    ).populate({ path: "property_images", select: "img_url type" });

    await property.updateLocationFromAddress(GOOGLE_API_KEY);
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
    const properties = await PropertiesModel.find({ user }).populate({
      path: "property_images",
      select: "img_url type",
    });
    const propertiesCounts = await PropertiesModel.countDocuments({ user });
    return res.status(200).json({ properties, totalCount: propertiesCounts });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
