import { UIContentModel } from "../../../models/AboutContent.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SetUIContent = async (req, res, next) => {
  const { title, body, images } = req.body;

  // Validate required fields
  if (!title || !body || !images) {
    return res.status(400).json({
      message: "Missing required fields: title, body, or images.",
    });
  }

  try {
    // Use findOneAndUpdate to either update an existing document or create a new one
    const updatedUIContent = await UIContentModel.findOneAndUpdate(
      {},
      { title, body, images },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json("UI Content set successfully");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to set UI Content", error: error.message });
  }
};
