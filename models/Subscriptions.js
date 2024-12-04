import { Schema, model } from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SubscriptionsSchema = new Schema({
    email: {
        type: String,
        validate: [
            {
                validator: function (email) {
                    return emailRegex.test(email);
                },
                message: "Invalid email format.",
            },
        ],
    }
}, {timestamps: true});

export const SubscriptionsModel = model("subscriptions", SubscriptionsSchema);