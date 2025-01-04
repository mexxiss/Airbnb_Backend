import parsePhoneNumberFromString from "libphonenumber-js";
import { Schema, model } from "mongoose";

const PropertyQuerySchema = new Schema({
    full_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (phone) {
                const phoneNumber = parsePhoneNumberFromString(phone);
                return phoneNumber && phoneNumber.isValid();
            },
            message:
                "Please provide a valid phone number in international format (e.g., +1234567890).",
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address.",
        ],
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const PropertyQueryModel = model("propertyquery", PropertyQuerySchema);