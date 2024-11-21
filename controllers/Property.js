import { PropertyModel } from "../models/Property.js";
import { AmenitiesModel } from "../models/Amenities.js";

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const { amenities } = req.body;

    // Validate amenities
    if (amenities?.amenitie_id?.length > 0) {
      const validAmenities = await AmenitiesModel.find({
        _id: { $in: amenities.amenitie_id },
      });
      if (validAmenities.length !== amenities.amenitie_id.length) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid amenitie_id provided" });
      }
    }

    const property = new PropertyModel(req.body);
    const savedProperty = await property.save();
    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await PropertyModel.find().populate(
      "vat_tax tourism_tax amenities.amenitie_id host_by.hostId ratings.reviews.userId"
    );
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await PropertyModel.findById(req.params.id).populate(
      "vat_tax tourism_tax amenities.amenitie_id host_by.hostId ratings.reviews.userId"
    );
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a property by ID
export const updatePropertyById = async (req, res) => {
  try {
    const { amenities } = req.body;

    // Validate amenities if updated
    if (amenities?.amenitie_id?.length > 0) {
      const validAmenities = await AmenitiesModel.find({
        _id: { $in: amenities.amenitie_id },
      });
      if (validAmenities.length !== amenities.amenitie_id.length) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid amenitie_id provided" });
      }
    }

    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: updatedProperty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a property by ID
export const deletePropertyById = async (req, res) => {
  try {
    const deletedProperty = await PropertyModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
