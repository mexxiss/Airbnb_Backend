import mongoose, { model } from "mongoose";

const AmenitiesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  icon: {
    type: String,
    required: [true, "title is icon"],
  },
});

export const AmenitiesModel = model("amenities", AmenitiesSchema);
