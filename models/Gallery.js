import mongoose, { model } from "mongoose";

const gallerySchema = new mongoose.Schema({
  key: { type: String },
  img_url: { type: String },
});

export const GalleryModel = model("gallery", gallerySchema);
