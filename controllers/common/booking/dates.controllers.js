import mongoose from "mongoose";
import { BookedDatesModel } from "../../../models/BookedDates.js";
import { apiError } from "../../../utils/apiError.js";

export const GetFilteredDates = async (req, res, next) => {
    // #swagger.tags = ['Users']
    const { start_date, property } = req.query;

    if (!property || !mongoose.isValidObjectId(property)) {
        return next(new apiError(400, "Valid Property ID not provided"));
    }

    const start_date_ISO = new Date(start_date).toISOString();
    const s_date = start_date ? new Date(start_date_ISO) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const e_date = new Date(s_date);
    e_date.setMonth(e_date.getMonth() + 4);

    const firstOfMonth = new Date(Date.UTC(s_date.getFullYear(), s_date.getMonth(), 1));
    const lastOfMonth = new Date(Date.UTC(s_date.getFullYear(), s_date.getMonth() + 1, 0));

    try {
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
                $addFields: {
                    dateDetails: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $and: [
                                            { $gte: ["$checkin_date", firstOfMonth] },
                                            { $lte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        month: { $month: "$checkin_date" },
                                        year: { $year: "$checkin_date" }
                                    }
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lt: ["$checkin_date", firstOfMonth] },
                                            { $gte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        month: { $month: firstOfMonth },
                                        year: { $year: firstOfMonth }
                                    }
                                },
                                {
                                    case: {
                                        $and: [
                                            { $gte: ["$checkin_date", firstOfMonth] },
                                            { $gte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        month: { $month: "$checkin_date" },
                                        year: { $year: "$checkin_date" }
                                    }
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lte: ["$checkin_date", firstOfMonth] },
                                            { $lte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        month: { $month: "$checkout_date" },
                                        year: { $year: "$checkout_date" }
                                    }
                                }
                            ],
                            default: { $month: firstOfMonth }
                        }
                    },
                    nights_count_dynamic: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $and: [
                                            { $gte: ["$checkin_date", firstOfMonth] },
                                            { $lte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        $dateDiff: {
                                            startDate: "$checkin_date",
                                            endDate: "$checkout_date",
                                            unit: "day"
                                        }
                                    },
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lt: ["$checkin_date", firstOfMonth] },
                                            { $gte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        $dateDiff: {
                                            startDate: firstOfMonth,
                                            endDate: lastOfMonth,
                                            unit: "day"
                                        }
                                    },
                                },
                                {
                                    case: {
                                        $and: [
                                            { $gte: ["$checkin_date", firstOfMonth] },
                                            { $gte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        $dateDiff: {
                                            startDate: "$checkin_date",
                                            endDate: lastOfMonth,
                                            unit: "day"
                                        }
                                    },
                                },
                                {
                                    case: {
                                        $and: [
                                            { $lte: ["$checkin_date", firstOfMonth] },
                                            { $lte: ["$checkout_date", lastOfMonth] }
                                        ]
                                    },
                                    then: {
                                        $dateDiff: {
                                            startDate: firstOfMonth,
                                            endDate: "$checkout_date",
                                            unit: "day"
                                        }
                                    },
                                }
                            ],
                            default: { $month: firstOfMonth }
                        }
                    }
                }
            },
            {
                $facet: {
                    totals: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$dateDetails.year", s_date.getFullYear()] },
                                        { $eq: ["$dateDetails.month", s_date.getMonth() + 1] }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total_stays: { $sum: 1 },
                                total_nights_count: { $sum: "$nights_count_dynamic" },
                                total_stay_charges: { $sum: "$cost_details.stay_charges" },
                                total_cleaning_fee: { $sum: "$cost_details.cleaning_fee" },
                                total_discount: { $sum: "$cost_details.discount" },
                                total_tourism_tax: { $sum: "$cost_details.tourism_tax" },
                                total_vat_tax: { $sum: "$cost_details.vat_tax" },
                                total_net_charges: { $sum: "$cost_details.net_charges" }
                            }
                        }
                    ],
                    documents: [
                        {
                            $project: {
                                _id: 1,
                                checkin_date: 1,
                                checkout_date: 1,
                                property: 1,
                                nights_count_dynamic: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    totals: { $arrayElemAt: ["$totals", 0] },
                    documents: 1
                }
            }
        ]);

        return res.status(200).json(dates[0]);
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
};
