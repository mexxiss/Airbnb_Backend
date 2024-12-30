import { BookedDatesModel } from "../../../models/BookedDates.js";
import { MaintenanceModel } from "../../../models/Maintenance.js";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

export const GetAllProperties = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get all properties with images and details populated along with other selected fields - Properties Page',
    try {
        const properties = await PropertiesModel.find().populate('property_images').select('title description property_images property_details.rooms_count status');
        return res.status(200).json(new apiResponse(200, properties, "Property retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetFullPropertiesObject = async (req, res, next) => {
    try {
        const properties = await PropertiesModel.find();
        return res.status(200).json(new apiResponse(200, properties, "Property retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetPropertyObj = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get a single property with images and details populated - Property Page',
    const { id } = req.params;
    const totals = {
        total_stay_charges: 0,
        total_discount: 0,
        total_cleaning_fee: 0,
        total_tourism_tax: 0,
        total_vat_tax: 0,
        total_net_charges: 0
    };

    try {
        const properties = await PropertiesModel.findById(id).populate("amenities").populate("property_images");

        const maintenanceSummary = await MaintenanceModel.aggregate([
            { $match: { property: new mongoose.Types.ObjectId(id) } },
            { $group: { _id: "$property", totalCost: { $sum: "$cost" } } } //, documents: { $push: "$$ROOT" } 
        ]);

        const bookDetails = await BookedDatesModel.aggregate([
            { $match: { property: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: "$property",
                    total_stays: { $sum: 1 },
                    total_nights_count: { $sum: "$nights_count" },
                    total_stay_charges: { $sum: "$cost_details.stay_charges" },
                    total_cleaning_fee: { $sum: "$cost_details.cleaning_fee" },
                    total_discount: { $sum: "$cost_details.discount" },
                    total_tourism_tax: { $sum: "$cost_details.tourism_tax" },
                    total_vat_tax: { $sum: "$cost_details.vat_tax" },
                    total_net_charges: { $sum: "$cost_details.net_charges" }
                }
            }
        ])

        const documentSize = Buffer.byteLength(JSON.stringify({properties, bookDetails, maintenanceSummary}));
        console.log("Document Size in Bytes:", documentSize);

        return res.status(200).json(
            new apiResponse(200, {
                properties,
                maintenanceSummary,
                bookDetails
                // bookDetails,
            }, "Property retrieved successfully")
        );
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
};