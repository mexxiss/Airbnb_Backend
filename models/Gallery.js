import mongoose, { model, Schema } from "mongoose";

const gallerySchema = new mongoose.Schema({
  img_url: { type: String },
  type: {
    type: Schema.Types.ObjectId,
    ref: "gallarytypes"
  }
});

export const GalleryModel = model("gallery", gallerySchema);