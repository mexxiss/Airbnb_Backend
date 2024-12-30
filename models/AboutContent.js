import { Schema, model } from "mongoose";

const UIContentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export const UIContentModel = model("ui_content", UIContentSchema);
