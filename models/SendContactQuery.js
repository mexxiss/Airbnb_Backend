import { model, Schema } from "mongoose";

// SendQuery Schema
const sendQuerySchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^5[02456]\d{7}$/,
        "Invalid Dubai phone number (9 digits, starting with 50, 52, 54, 55, or 56)",
      ],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [3, "Subject must be at least 3 characters long"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

// Model
const SendQuery = model("SendQuery", sendQuerySchema);

export default SendQuery;
