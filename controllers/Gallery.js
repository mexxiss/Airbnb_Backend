import { GalleryModel } from "../models/Gallery.js";

export const createGalleryContent = async (req, res) => {
  try {
    const { key, img_url } = req.body;
    const newGallery = new GalleryModel({ key, img_url });
    const savedGallery = await newGallery.save();

    res
      .status(201)
      .json({ msg: "amenities created successfully", data: savedGallery });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const getGalleryImagesByQuery = async (req, res) => {
  try {
    const { key, all } = req.query;

    // MongoDB Aggregation Pipeline
    const pipeline = [];

    //  Filter by `key` if provided
    if (key && all !== "true") {
      pipeline.push({
        $match: { key: key },
      });
    }

    // Project specific fields
    pipeline.push({
      $project: {
        _id: 0,
        key: 1,
        img_url: 1,
      },
    });

    // Sort by key
    pipeline.push({
      $sort: { key: 1 },
    });

    // Execute the Aggregation Pipeline
    const galleryData = await GalleryModel.aggregate(pipeline);

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
