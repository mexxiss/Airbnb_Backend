import {Schema, model} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import { mailSender } from "../utils/mailSender.js";

const PassResetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        unique: true,
    },
    resetPassUrl: {
        type: String,
    },
    resetToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})

PassResetSchema.pre("save", async function (next) {
    if(this.isNew) {
        try {
            await this.setResetPassToken();
            const mailResponse = await mailSender(this.user.email, "Password Reset Request", `<p>To reset your password, please click this link:</p><p>${this.resetPassUrl}</p>`);

            if (mailResponse && !mailResponse.error) {
                next(); 
            } else {
                next(new apiError(500, mailResponse.message || "Failed to send email"));
            }
        } catch (error) {
            next(new apiError(500, error.message || "An error occurred while setting the reset token"));
        }
    } else {
        // console.log("Not New")
       next();
    }
})

PassResetSchema.methods.setResetPassToken = async function () {
    const {CLIENT_URL, JWT_SECRET, RESET_PASS_EXPIRY} = process.env;

    try {
        const resetToken = await jsonwebtoken.sign(
            {_id: this._id},
            JWT_SECRET,
            {expiresIn: RESET_PASS_EXPIRY}
        );

        this.resetToken = resetToken;
        this.resetPassUrl = `${CLIENT_URL}/reset-url/${resetToken}`;
    } catch (error) {
        throw new Error("Error generating reset token");
    }
    return;
}

PassResetSchema.methods.changeUserPassword = async function (password) {
    try {
        if (!this.user || !this.user.save) {
            await this.populate('user'); // Replace 'user' with the correct path name if necessary
        }

        if (!this.user) {
            throw new Error("User not found in the current reset instance.");
        }

        this.user.password = password;
        await this.user.save({ validateBeforeSave: false });
        await this.deleteOne();
        return this.user;
    } catch (error) {
        throw new Error(error);
    }
}

export const PassResetModel = model("passreset", PassResetSchema);