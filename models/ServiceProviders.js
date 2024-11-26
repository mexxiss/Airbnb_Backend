import { Schema, model } from "mongoose";

const ProvidersSchema = new Schema({
    internet: {
        service_providers: [{
            name: { type: String, required: true },
        }]
    },
    electricity_water: {
        service_providers: [{
            name: { type: String, required: true },
        }]
    },
    gas: {
        service_providers: [{
            name: { type: String, required: true },
        }],
    },
    chiller: {
        service_providers: [{
            name: { type: String, required: true },
        }],
    },
    other: {
        service_providers: [{
            name: { type: String, required: true },
        }],
    }
}, { timestamps: true });

// Middleware to limit documents
ProvidersSchema.post("save", async function () {
    try {
        const maxDocuments = 1;
        const count = await this.constructor.countDocuments();
        if (count > maxDocuments) {
            const oldestDocument = await this.constructor.findOne().sort({ createdAt: 1 });
            if (oldestDocument) {
                await this.constructor.deleteOne({ _id: oldestDocument._id });
            }
        }
    } catch (err) {
        console.error("Error in post-save middleware:", err);
    }
});

export const ProvidersModel = model("providers", ProvidersSchema);
