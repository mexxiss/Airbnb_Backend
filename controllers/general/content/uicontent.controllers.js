import { UIContentModel } from "../../../models/AboutContent.js";

export const GetUIContent = async (req, res, next) => {
  try {
    const uiContent = await UIContentModel.findOne();
    if (!uiContent) {
      return res.status(404).json({ message: "UI Content not found" });
    }
    res.status(200).json(uiContent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch UI Content", error: error.message });
  }
};
