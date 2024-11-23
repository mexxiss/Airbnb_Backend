import { Schema, model } from "mongoose";

const BookedDatesSchema = new Schema({
    checkin_date: {
        type: Date,
        required: true,
    },
    checkout_date: {
        type: Date,
        required: true
    },
    nights_count: {
        type: Number,
        required: true,
    },
    cost_details: {
        currency: {
            type: String,
            required: true,
            default: "AER",
        },
        stay_charges: {
            type: Number,
            required: true,
            default: 0.0,
            min: [0, "Amount cannot be negative"]
        },
        discount: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Amount cannot be negative"]
        },
        cleaning_fee: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Amount cannot be negative"]
        },
        tourism_tax: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Amount cannot be negative"]
        },
        vat_tax: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Amount cannot be negative"]
        },
        net_charges: {
            type: Number,
            required: true,
            min: [0, "Amount cannot be negative"]
        }
    },
    bookDetails: {
        type: [Schema.Types.ObjectId],
        ref: "bookDetails",
        required: true
    },
    propertyId: {
        type: [Schema.Types.ObjectId],
        ref: "properties",
        required: true
    }
}, { timestamps: true });

BookedDatesSchema.methods.isAvailable = async function (checkinDate, checkoutDate) {
    const existingBookings = await this.model('bookedDates').find({
        propertyId: this.propertyId,
        $or: [
            { checkin_date: { $lte: checkoutDate }, checkout_date: { $gte: checkinDate } },
            { checkin_date: { $gte: checkinDate }, checkout_date: { $lte: checkoutDate } }
        ]
    });

    return existingBookings.length === 0;
};

export const BookedDatesModel = model("bookedDates", BookedDatesSchema)