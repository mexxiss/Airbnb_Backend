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
        const properties = await PropertiesModel.find().populate('property_images amenities')
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

        const documentSize = Buffer.byteLength(JSON.stringify({ properties, bookDetails, maintenanceSummary }));

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

export const getPropertiesForBooking = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get properties for booking based on location, check-in, check-out, and room type',
    const { page = 1, limit = 4 } = req.query;

    try {
        const properties = await PropertiesModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("property_images");
        return res.status(200).json(new apiResponse(200, properties, "Properties retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const getFullPropertyById = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get a full property by ID with all related data',
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) {
        return next(new apiError(400, "Property ID required"));
    }
    try {
        const property = await PropertiesModel.findById(id).populate("property_images amenities");
        if (!property) {
            return next(new apiError(404, "Property not found"));
        }
        return res.status(200).json(new apiResponse(200, property, "Property retrieved successfully"));
    } catch (e) {
        return next(new apiError(500, `Server Error: ${e}`));
    }
}

export const getFilteredPropertiesForBooking = async (req, res, next) => {
    const { page = 1, limit = 4 } = req.query;
    const { destination, check_in, check_out, bedrooms, guests, area, sort } = req.body;

    try {
        let query = {};

        if (check_in && check_out) {
            const checkInDate = new Date(check_in);
            const checkOutDate = new Date(check_out);

            const bookedProperties = await BookedDatesModel.find({
                $or: [
                    {
                        checkin_date: { $lt: checkOutDate },
                        checkout_date: { $gt: checkInDate }
                    }
                ]
            }).distinct("property");

            query._id = { $nin: bookedProperties };
        }

        if (bedrooms) query["property_details.beds_count"] = { $gte: parseInt(bedrooms) };
        if (guests) query["property_details.max_guest_count"] = { $gte: parseInt(guests) };
        if (area) query["address.area"] = area;
        if (destination) query["address.country"] = destination;

        let sortCriteria = {};
        if (sort === "price_low") {
            sortCriteria = { "costs.prices.price_per_night": 1 };
        } else if (sort === "price_high") {
            sortCriteria = { "costs.prices.price_per_night": -1 };
        } else {
            sortCriteria = { _id: 1 }; 
        }

        // Aggregation pipeline
        const result = await PropertiesModel.aggregate([
            { $match: query },
            {
                $facet: {
                    totalCount: [{ $count: "count" }], // Count total matching documents
                    properties: [
                        { $sort: sortCriteria },
                        { $skip: (page - 1) * limit },
                        { $limit: parseInt(limit) },
                        {
                            $lookup: {
                                from: "galleries",
                                localField: "property_images",
                                foreignField: "_id",
                                as: "property_images"
                            }
                        }
                    ]
                }
            }
        ]);

        const totalCount = result[0]?.totalCount[0]?.count || 0;
        const properties = result[0]?.properties || [];

        return res
            .status(200)
            .json(new apiResponse(200, { properties, totalCount }, "Properties retrieved successfully"));
    } catch (err) {
        console.log(err.message);
        
        return next(new apiError(500, `Server Error: ${err.message}`));
    }
};
