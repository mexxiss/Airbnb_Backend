import { BookedDatesModel } from "../models/BookedDates.js";
import { PropertiesModel } from "../models/Properties.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { UtilityModel } from "../models/Utility.js";
import mongoose from "mongoose";

export const GetFilteredDates = async (req, res, next) => {
    const { start_date, property } = req.query;

    if (!property && mongoose.isValidObjectId(property)) {
        return next(new apiError(400, "Property ID not provided"));
    }

    const s_date = start_date ? new Date(start_date) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const e_date = new Date(s_date);
    e_date.setMonth(e_date.getMonth() + 4);

    try {
        // const dates = await BookedDatesModel.aggregate([
        //     {
        //         $match: {
        //             property: new mongoose.Types.ObjectId(property),
        //             $expr: {
        //                 $and: [
        //                     { $gte: ["$checkout_date", s_date] },
        //                     { $lte: ["$checkin_date", e_date] }
        //                 ]
        //             },
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             total_stays: { $sum: 1 },
        //             total_nights_count: { $sum: "$nights_count" },
        //             total_stay_charges: { $sum: "$cost_details.stay_charges" },
        //             total_cleaning_fee: { $sum: "$cost_details.cleaning_fee" },
        //             total_discount: { $sum: "$cost_details.discount" },
        //             total_tourism_tax: { $sum: "$cost_details.tourism_tax" },
        //             total_vat_tax: { $sum: "$cost_details.vat_tax" },
        //             total_net_charges: { $sum: "$cost_details.net_charges" },
        //             documents: {$push: "$$ROOT"}
        //         }
        //     },
        // ]);

        const dates = await BookedDatesModel.aggregate([
            {
                $match: {
                    property: new mongoose.Types.ObjectId(property),
                    $expr: {
                        $and: [
                            { $gte: ["$checkout_date", s_date] },
                            { $lte: ["$checkin_date", e_date] }
                        ]
                    }
                }
            },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: { month: { $month: "$checkout_date" }, year: { $year: "$checkout_date" } },
                                total_stays: { $sum: 1 },
                                total_nights_count: { $sum: "$nights_count" },
                                total_stay_charges: { $sum: "$cost_details.stay_charges" },
                                total_cleaning_fee: { $sum: "$cost_details.cleaning_fee" },
                                total_discount: { $sum: "$cost_details.discount" },
                                total_tourism_tax: { $sum: "$cost_details.tourism_tax" },
                                total_vat_tax: { $sum: "$cost_details.vat_tax" },
                                total_net_charges: { $sum: "$cost_details.net_charges" },
                            }
                        },
                        {
                            $sort: { "_id.year": 1, "_id.month": 1 }  
                        },
                        {
                            $limit: 1  
                        }
                    ],
                    documents: [
                        {
                            $project: {
                                _id: 1,
                                checkin_date: 1,
                                checkout_date: 1,
                                property: 1,
                                nights_count: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    totals: { $arrayElemAt: ["$totals", 0] },  // Extract the first group's total calculations
                    documents: 1
                }
            }
        ]);

        return res.status(200).json(dates[0]);
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const GetBookedDates = async (req, res, next) => {
    try {
        const { property } = req.query;
        const query = { checkout_date: { $gte: new Date() } };

        if (property) {
            query.property = property;
        }

        const dates = await BookedDatesModel.find(query);

        return res.status(200).json(new apiResponse(200, dates, "Booked dates retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
};

export const SetBookedDates = async (req, res, next) => {
    const { checkin_date, checkout_date, property } = req.body;

    try {
        const propertyDoc = await PropertiesModel.findById(property);
        if (!propertyDoc) {
            return next(new apiError(400, "Property not found"));
        }

        const utility = await UtilityModel.findOne();
        if (!utility) {
            return next(new apiError(400, "Utility Document Error"));
        }

        const bookedDates = new BookedDatesModel({ checkin_date, checkout_date, property });
        bookedDates.nights_count = await bookedDates.getNightsCount(checkin_date, checkout_date);
        bookedDates.cost_details = await propertyDoc.calculateCosts(bookedDates.nights_count, bookedDates.discount, utility.vat_tax_rate, utility.tourism_tax_rate);

        await bookedDates.save();
        return res.status(200).json(new apiResponse(200, bookedDates, "Dates Booked"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteBookedDates = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new apiError(400, "ID not provided"))
    }

    try {
        const date = await BookedDatesModel.deleteOne(id);
        return res.status(200).json(new apiResponse(200, date, "Deleted Booked Date"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}