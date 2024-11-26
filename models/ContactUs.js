import { model, Schema } from "mongoose";

const contactUsSchema = new Schema({
  emails: [String],
  phones: [String],
  location: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: String,
    },
    address: {
      type: String,
    },
    coordinates: [
      {
        lat: {
          type: Number,
        },
        long: {
          type: Number,
        },
      },
    ],
  },
});

export const ContactUsModel = model("contectus", contactUsSchema);
