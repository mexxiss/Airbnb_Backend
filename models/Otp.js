import { Schema, model } from "mongoose";
import { mailSender } from "../utils/mailSender.js";
import { apiError } from "../utils/apiError.js";

const OtpSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
}, {timestamps: true})

OtpSchema.pre("save", async function (next) {
    if(this.isNew) {
        const mailResponse = await mailSender(this.email, "OTP Verification Email from BloggerLite", `<p>Please confirm your OTP: ${this.otp}</p>`);
        if(mailResponse && !mailResponse.error) {
            next();
        } else {
            next(new apiError(500, mailResponse.message));
        }
    }
});

export const OtpModel = model("otp", OtpSchema);