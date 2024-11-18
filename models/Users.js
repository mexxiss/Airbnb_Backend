import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import jsonwebtoken from "jsonwebtoken";

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Email is not Valid"]
    },
    password: {
        type: String,
        maxLength: 50,
        minLength: 6,
        validate: [
            function (password) {
                return /[@$#!&*^]/.test(password);
            },
            "Password must contain at least 1 special character (@, $, #, !, &, *, or ^)"
        ]
    },
    confirmPassword: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

UserSchema.pre("save", function (next) {
    if (this.confirmPassword) {
        this.confirmPassword = undefined;
    }

    if (this.isModified("password")) {
        const hashedPass = bcrypt.hashSync(this.password);
        this.password = hashedPass;
        next();
    } else {
        return next();
    }
});

UserSchema.methods.compareBcryptPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
    const { JWT_SECRET, JWT_EXPIRY } = process.env;
    const accessToken = await jsonwebtoken.sign(
        { _id: this._id, email: this.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
    if (accessToken) {
        this.isLoggedIn = true;
        this.accessToken = accessToken;
        await this.save({ validateBeforeSave: false });
        return accessToken;
    }
};

UserSchema.methods.logout = async function () {
    this.isLoggedIn = false;
    this.accessToken = "";
    await this.save({ validateBeforeSave: false });
    return;
}

export const UserModel = model("users", UserSchema);