import DETLicense from "../../../models/DETLicense.js";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

// @desc   Create a new DET license
// @route  POST /api/licenses
// @access Admin
export const addLicense = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can add new DET licenses"
  // #swagger.description = "> Adds a new DET license for a property and user"

  /* #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: { $ref: "#/components/schemas/DETLicenseRequest" }
          }
      }
  } */

  const { licenseNumber, owner, property, status, price } = req.body;

  const existLicense = await DETLicense.findOne({ owner, property });
  if (existLicense) {
    return res.status(400).json({ error: "License already exists" });
  }

  try {
    const newLicense = await DETLicense.create({
      licenseNumber,
      owner,
      property,
      status,
      price,
    });

    await PropertiesModel.findByIdAndUpdate(
      property,
      { $set: { licenses: newLicense._id } },
      { new: true }
    );

    return res
      .status(200)
      .json(new apiResponse(200, newLicense, "License added successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

// @desc   Get all DET licenses
// @route  GET /api/licenses
// @access Admin/User
export const getLicenses = async (req, res, next) => {
  try {
    let { page, limit, search, sortBy, sortOrder, status, owner } = req.query;

    // Set default values for pagination
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortOrder = sortOrder === "asc" ? 1 : -1; // Default to descending

    const filter = {};

    // Search by licenseNumber (case-insensitive)
    if (search) {
      filter.licenseNumber = { $regex: search, $options: "i" };
    }

    // Filter by status (paid/unpaid)
    if (status) {
      filter.status = status;
    }

    // Filter by owner ID
    if (owner) {
      filter.owner = owner;
    }

    // Define sorting options (default to `createdAt`)
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions["createdAt"] = -1;
    }

    const totalLicenses = await DETLicense.countDocuments(filter);
    const licenses = await DETLicense.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("");

    return res.status(200).json(
      new apiResponse(
        200,
        {
          licenses,
          currentPage: page,
          totalPages: Math.ceil(totalLicenses / limit),
          totalLicenses,
        },
        "Licenses retrieved successfully"
      )
    );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

// @desc   Get single DET license by ID
// @route  GET /api/licenses/:id
// @access Admin/User
export const getLicenseById = async (req, res, next) => {
  try {
    const license = await DETLicense.findById(req.params.id).populate(
      "owner property"
    );
    if (!license) {
      return next(new apiError(404, "License not found"));
    }
    return res
      .status(200)
      .json(new apiResponse(200, license, "License retrieved successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

// @desc   Update a DET license
// @route  PUT /api/licenses/:id
// @access Admin
export const updateLicense = async (req, res, next) => {
  try {
    const updatedLicense = await DETLicense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLicense) {
      return next(new apiError(404, "License not found"));
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, updatedLicense, "License updated successfully")
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

// @desc   Delete a DET license
// @route  DELETE /api/licenses/:id
// @access Admin
export const deleteLicense = async (req, res, next) => {
  try {
    const deletedLicense = await DETLicense.findByIdAndDelete(req.params.id);

    if (!deletedLicense) {
      return next(new apiError(404, "License not found"));
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, deletedLicense, "License deleted successfully")
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

// @desc   Renew a DET license
// @route  PATCH /api/licenses/:id/renew
// @access Admin
export const renewLicense = async (req, res, next) => {
  try {
    const license = await DETLicense.findById(req.params.id);
    if (!license) {
      return next(new apiError(404, "License not found"));
    }

    license.renewLicense();
    await license.save();

    return res
      .status(200)
      .json(new apiResponse(200, license, "License renewed successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};
