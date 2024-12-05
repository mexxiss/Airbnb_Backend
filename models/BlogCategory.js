import { Schema, model } from "mongoose";

const BlogsCategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    }
}, {timestamps: true});

export const BlogCategoryModel = model("blogcategory", BlogsCategorySchema);