import { GalleryModel } from "../../../models/Gallery.js";

export const getGalleryImagesByQuery = async (req, res) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Get gallery images with pagination - Gallery Page"
  
  try {
    const { id, page = 1, limit = 12 } = req.query; // type as id
    const query = {};

    if (id && mongoose.isValidObjectId(id)) {
      query.type = new mongoose.Types.ObjectId(id)
    }
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));

    const galleryData = await GalleryModel.find(query).populate("type").skip((pageNumber-1)*limitNumber).limit(limitNumber);

    return res.status(200).json({
      success: true,
      count: galleryData.length,
      data: galleryData,
    });
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
