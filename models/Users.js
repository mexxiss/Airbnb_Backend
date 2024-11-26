import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const UserSchema = new Schema({
    fullname: { type: String, required: true },
    email: {
        type: [String],
        required: true,
        validate: [
            {
                validator: function (emails) {
                    return emails.every((email) => validator.isEmail(email));
                },
                message: "One or more emails are invalid.",
            },
        ],
    },
    phone: {
        type: [String],
        required: true,
        validate: [
            {
                validator: function (phones) {
                    return phones.every((phone) => {
                        const phoneNumber = parsePhoneNumberFromString(phone);
                        return phoneNumber && phoneNumber.isValid();
                    });
                },
                message: "One or more phone numbers are invalid.",
            },
        ],
    },
    password: {
        type: String,
        required: true,
    },
    accessToken: { type: String },
    isLoggedIn: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ["Owner", "Admin"],
        default: "Owner",
    },
    paymentDetails: {
        bankAccount: {
            accountHolderName: { type: String },
            accountNumber: { type: String },
            bankName: { type: String },
            swiftCode: { type: String },
            iban: { type: String },
        },
        paymentMethod: {
            type: String,
            enum: ["Bank Transfer", "PayPal", "Stripe"],
            default: "Bank Transfer",
        },
    },
    address: {
        building_no: { type: String },
        city: { type: String },
        street: { type: String },
        area: { type: String },
        landmark: { type: String },
        country: { type: String, default: "Dubai" },
        pincode: { type: String },
    },
    documents: {
        dewaBills: [
            {
                url: {
                    type: String,
                    // required: true,
                },
            },
        ],
        passport: {
            url: {
                type: String,
                // required: true,
            },
            expiryDate: {
                type: Date,
                // required: true, 
            },
        },
        titleDeed: {
            url: {
                type: String,
                // required: true,
            }
        },
    },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.compareBcryptPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
    const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
    const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";
    const accessToken = jsonwebtoken.sign(
        { _id: this._id, email: this.email[0] },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
    this.isLoggedIn = true;
    this.accessToken = accessToken;
    await this.save({ validateBeforeSave: false });
    return accessToken;
};

UserSchema.methods.logout = async function () {
    this.isLoggedIn = false;
    this.accessToken = "";
    await this.save({ validateBeforeSave: false });
    return;
};

export const UserModel = model("users", UserSchema);