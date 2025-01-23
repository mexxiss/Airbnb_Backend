import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    profile_img: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1737112104~exp=1737115704~hmac=b3d9985b852ca5b6625c878877ca3ce60d09ed39e910328666c8bf2cd362b1c7&w=826",
    },
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
    isDeleted: { type: Boolean, default: false },
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
    address: {
      building_no: { type: String },
      city: { type: String },
      street: { type: String },
      area: { type: String },
      landmark: { type: String },
      country: { type: String },
      pincode: { type: String },
    },
  },
  { timestamps: true }
);

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
    {
      _id: this._id,
      role: this.role,
      name: `${this.full_name} ${this.last_name}`,
    },
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
