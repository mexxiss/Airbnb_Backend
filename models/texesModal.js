import mongoose from "mongoose";

const texesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  tex_type: {
    type: String,
    required: [true, "name is tex_type"],
  },
  tex_ratio: {
    type: Number,
    required: [true, "name is tex_ratio"],
  },
});

export const TexModel = model("texes", texesSchema);
