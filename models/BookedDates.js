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
            default: "AED",
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
    property: {
        type: Schema.Types.ObjectId,
        ref: "properties",
        required: true
    }
}, { timestamps: true });

BookedDatesSchema.index({property: 1})

BookedDatesSchema.methods.getNightsCount = async function (checkin_date, checkout_date) {
    const oneDay = 24 * 60 * 60 * 1000;
    const nights_count = Math.ceil((new Date(checkout_date) - new Date(checkin_date)) / oneDay);
    if (nights_count <= 0) {
        throw new Error("Check-out date must be after check-in date.");
    }
    return nights_count;
}

BookedDatesSchema.methods.isAvailable = async function (checkinDate, checkoutDate) {
    const existingBookings = await this.model("bookedDates").find({
        property: this.property,
        $or: [
            { 
                checkin_date: { $lt: new Date(checkoutDate) }, 
                checkout_date: { $gt: new Date(checkinDate) } 
            }
        ]
    });
    return existingBookings.length === 0;
};


export const BookedDatesModel = model("bookedDates", BookedDatesSchema)