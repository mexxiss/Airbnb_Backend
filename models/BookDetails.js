import { Schema, model } from "mongoose";
import validator, { trim } from "validator";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const BookDetailsSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, "Email is not valid"]
    },
    guests: {
        type: Number,
        required: true,
        default: 1,
        min: [1, "There must be at least one guest."],
    },
    phone_number: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const phoneNumber = parsePhoneNumberFromString(value);
                return phoneNumber && phoneNumber.isValid();
            },
            message: 'Phone number is invalid. It must include the country code.',
        },
    },
    message: {
        type: String,
        maxlength: [1000, "Message cannot exceed 1000 characters."],
    },
    promo_code: {
        type: String,
        match: [/^[a-zA-Z0-9]*$/, "Promo code must be alphanumeric."],
    },
    newsletter_agree: {
        type: Boolean,
        required: true,
        default: false
    },
    property_id: {
        type: Schema.Types.ObjectId,
        ref: "properties",
        required: true,
    },
    booked_dates: {
        type: Schema.Types.ObjectId,
        ref: "bookedDates",
        required: true
    },
}, { timestamps: true });

export const BookDetailsModel = model("bookDetails", BookDetailsSchema);