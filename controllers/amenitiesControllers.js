import { AmenitiesModel } from "../models/AmenitiesModel.js";

// create amenities

const createAmenities = async (req, res) => {
  try {
    const { title, icon } = req.body;

    // Validate request
    if (!title || !icon) {
      return res.status(400).json({ error: "Title and icon are required." });
    }

    const newAmenity = new AmenitiesModel({ title, icon });
    const savedAmenity = await newAmenity.save();

    res.status(201).json({
      msg: "amenities created successfully",
      data: savedAmenity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all amenities

const getAllAmenities = async (req, res) => {
  try {
    const amenities = await AmenitiesModel.find();
    res.status(200).json({ msg: "data feched succefully", data: amenities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get amenities by id

const getAmenitiesById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid amenity ID." });
    }

    const amenity = await AmenitiesModel.findById(id);
    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found." });
    }

    res.status(200).json(amenity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update amenities by id

const updateAmenities = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid amenity ID." });
    }

    // Validate input
    if (!title && !icon) {
      return res.status(400).json({
        error: "At least one field (title or icon) is required to update.",
      });
    }

    const updatedAmenity = await AmenitiesModel.findByIdAndUpdate(
      id,
      { title, icon },
      { new: true, runValidators: true }
    );

    if (!updatedAmenity) {
      return res.status(404).json({ error: "Amenity not found." });
    }

    res.status(200).json(updatedAmenity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete amenities by id

const deleteAmenities = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid amenity ID." });
    }

    const deletedAmenity = await AmenitiesModel.findByIdAndDelete(id);

    if (!deletedAmenity) {
      return res.status(404).json({ error: "Amenity not found." });
    }

    res.status(200).json({ message: "Amenity deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createAmenities,
  getAllAmenities,
  getAmenitiesById,
  updateAmenities,
  deleteAmenities,
};
