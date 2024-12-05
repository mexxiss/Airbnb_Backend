import { Schema, model } from "mongoose";

const MediaFeaturedArticlesSchema = new Schema({
    added_on: {
        type: String
    },
    third_party: {
        type: Schema.Types.ObjectId,
        ref: "thirdpartylogos",
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, {timestamps: true});

MediaFeaturedArticlesSchema.pre("save", function (next) {
    const date = this.added_on ? new Date(this.added_on) : new Date();
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
    this.added_on = formattedDate;
    next();
});

export const MediaFeaturedArticlesModel = model("mediafeaturedarticles", MediaFeaturedArticlesSchema);