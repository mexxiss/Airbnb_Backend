import parsePhoneNumberFromString from "libphonenumber-js";
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
      trim: true, // Trim leading/trailing spaces
      validate: {
        validator: function (phone) {
          const phoneNumber = parsePhoneNumberFromString(phone);
          return phoneNumber && phoneNumber.isValid();
        },
        message:
          "Please provide a valid phone number in international format (e.g., +1234567890).",
      },
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
