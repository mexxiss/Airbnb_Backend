import { Schema, model } from "mongoose";

const BookedDatesSchema = new Schema(
  {
    checkin_date: {
      type: Date,
    },
    checkout_date: {
      type: Date,
    },
    nights_count: {
      type: Number,
    },
    source: {
      type: String,
      default: "booking.com",
    },
    reservationCode: {
      type: String,
    },
    cost_details: {
      currency: {
        type: String,
        default: "AED",
      },
      stay_charges: {
        type: Number,

        default: 0.0,
        min: [0, "Amount cannot be negative"],
      },
      discount: {
        type: Number,

        default: 0,
        min: [0, "Amount cannot be negative"],
      },
      cleaning_fee: {
        type: Number,

        default: 0,
        min: [0, "Amount cannot be negative"],
      },
      tourism_tax: {
        type: Number,

        default: 0,
        min: [0, "Amount cannot be negative"],
      },
      vat_tax: {
        type: Number,

        default: 0,
        min: [0, "Amount cannot be negative"],
      },
      net_charges: {
        type: Number,

        min: [0, "Amount cannot be negative"],
      },
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "properties",
    },
    book_details: {
      type: Schema.Types.ObjectId,
      ref: "bookDetails",
    },
    access_card_keys: {
      type: String,
      enum: [
        "Yes, I require both",
        "I have an access card, but I require keys",
        "I have keys, but I require an access card",
        "No, I have both keys and an access card",
      ],
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

BookedDatesSchema.index({ property: 1 });

BookedDatesSchema.methods.getNightsCount = async function (
  checkin_date,
  checkout_date
) {
  const oneDay = 24 * 60 * 60 * 1000;
  const nights_count = Math.ceil(
    (new Date(checkout_date) - new Date(checkin_date)) / oneDay
  );
  if (nights_count <= 0) {
    throw new Error("Check-out date must be after check-in date.");
  }
  return nights_count;
};

BookedDatesSchema.methods.isAvailable = async function (
  checkinDate,
  checkoutDate
) {
  const existingBookings = await this.model("bookedDates").find({
    property: this.property,
    $or: [
      {
        checkin_date: { $lt: new Date(checkoutDate) },
        checkout_date: { $gt: new Date(checkinDate) },
      },
    ],
  });
  return existingBookings.length === 0;
};

export const BookedDatesModel = model("bookedDates", BookedDatesSchema);
