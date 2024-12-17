import { GalleryModel } from "../../../models/Gallery.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const createGalleryContent = async (req, res) => {
  // #swagger.tags = ['Admin']
  try {
    const { img_url, type } = req.body;
    const newGallery = new GalleryModel({ img_url, type });
    const savedGallery = await newGallery.save();

    res
      .status(201)
      .json({ msg: "amenities created successfully", data: savedGallery });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const UpdateGallary = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { type } = req.body;
    const { id } = req.params;
  
    if (!id) {
      return next(new apiError(400, "Please provide valid document ID"));
    }
  
    try {
      const gallaryDoc = await GalleryModel.findByIdAndUpdate(id, { $set: { type } }, { new: true, runValidators: true });
      return res.status(200).json(new apiResponse(200, gallaryDoc, "Done"));
    } catch (error) {
      return next(new apiError(500, `Server Error: ${error}`));
    }
  }