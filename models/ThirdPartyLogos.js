import { Schema, model } from "mongoose";

const ThirdPartyLogoSchema = new Schema({
    logo: {
        type: String,
        required: true,
    },
    brand_image: {
        type: String,
    },
    type: {
        type: String,
        enum: ["trusted", "listing"],
        required: true,
    },
    name: {
        type: String,
    }
});

export const ThirdPartyLogoModel = model("thirdpartylogos", ThirdPartyLogoSchema);