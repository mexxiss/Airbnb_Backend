import { Schema, model } from "mongoose";

const UtilitySchema = new Schema({
    vat_tax_rate: {
        type: Number,
        required: true,
        default: 12
    },
    tourism_tax_rate: {
        type: Number,
        required: true,
        default: 30
    }
},  { timestamps: true });

UtilitySchema.post("save", async function () {
    const maxDocuments = 1; 
    const Model = this.constructor; 

    const count = await Model.countDocuments();
    if (count > maxDocuments) {
        const oldestDocument = await Model.findOne().sort({ createdAt: 1 }); 
        if (oldestDocument) {
            await Model.deleteOne({ _id: oldestDocument._id }); 
        }
    }
});

export const UtilityModel = model("utility", UtilitySchema);