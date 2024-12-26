import { Schema, model } from "mongoose";
import validator from "validator";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { mailSender } from "../utils/mailSender.js";
import { apiError } from "../utils/apiError.js";

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
    property: {
        type: Schema.Types.ObjectId,
        ref: "properties",
        required: true,
    },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Checked Out'], default: 'Confirmed' }
}, { timestamps: true });

BookDetailsSchema.index({ property: 1 });
BookDetailsSchema.index({ booked_dates: 1 });

BookDetailsSchema.pre("save", async function(next) {
    if(this.isNew) {
        const mailResponse = await mailSender(this.email, "Booking Request Received", `<p>Your request for booking property - ${this.property} - has been acknowledged.</p><p>We will be contacting you shortly</p><p>Mexxiss Property Management Team</p>`);
        if(mailResponse && !mailResponse.error) {
            next();
        } else {
            next(new apiError(500, mailResponse.message));
        }
    }
})

export const BookDetailsModel = model("bookDetails", BookDetailsSchema);