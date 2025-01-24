import mongoose from "mongoose";

const getDaysInMonth = (year, month) => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
    if ([4, 6, 9, 11].includes(month)) return 30;
    return (year % 4 === 0) ? 29 : 28;
};

const getOccupancyAggregation = (property, firstOfMonth, e_date) => [
    {
        $match: {
            property: new mongoose.Types.ObjectId(property),
            $expr: {
                $and: [
                    { $gte: ["$checkout_date", firstOfMonth] },
                    { $lte: ["$checkin_date", e_date] }
                ]
            }
        }
    },
    {
        $addFields: {
            monthRange: {
                $map: {
                    input: {
                        $range: [
                            0,
                            {
                                $add: [
                                    1,
                                    {
                                        $multiply: [
                                            12,
                                            {
                                                $subtract: [
                                                    { $year: "$checkout_date" },
                                                    { $year: "$checkin_date" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $subtract: [
                                            { $month: "$checkout_date" },
                                            { $month: "$checkin_date" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    as: "monthDiff",
                    in: {
                        $dateAdd: {
                            startDate: {
                                $dateFromParts: {
                                    year: { $year: "$checkin_date" },
                                    month: { $month: "$checkin_date" },
                                    day: 1
                                }
                            },
                            unit: "month",
                            amount: "$$monthDiff"
                        }
                    }
                }
            }
        }
    },
    { $unwind: "$monthRange" },
    {
        $addFields: {
            yearMonth: {
                year: { $year: "$monthRange" },
                month: { $month: "$monthRange" }
            },
            monthStart: {
                $dateFromParts: {
                    year: { $year: "$monthRange" },
                    month: { $month: "$monthRange" },
                    day: 1
                }
            },
            monthEnd: {
                $dateFromParts: {
                    year: { $year: "$monthRange" },
                    month: { $add: [{ $month: "$monthRange" }, 1] },
                    day: 1
                }
            }
        }
    },
    {
        $addFields: {
            monthNights: {
                $dateDiff: {
                    startDate: {
                        $max: ["$checkin_date", "$monthStart"]
                    },
                    endDate: {
                        $min: ["$checkout_date", "$monthEnd"]
                    },
                    unit: "day"
                }
            }
        }
    },
    {
        $group: {
            _id: "$yearMonth",
            total_nights_booked: { $sum: "$monthNights" }
        }
    },
    {
        $addFields: {
            days_in_month: {
                $switch: {
                    branches: [
                        {
                            case: { $in: ["$_id.month", [1, 3, 5, 7, 8, 10, 12]] },
                            then: 31
                        },
                        {
                            case: { $in: ["$_id.month", [4, 6, 9, 11]] },
                            then: 30
                        },
                        {
                            case: {
                                $and: [
                                    { $eq: ["$_id.month", 2] },
                                    {
                                        $eq: [
                                            { $mod: ["$_id.year", 4] },
                                            0
                                        ]
                                    }
                                ]
                            },
                            then: 29
                        }
                    ],
                    default: 28
                }
            }
        }
    },
    {
        $addFields: {
            occupancy_percentage: {
                $round: [
                    {
                        $multiply: [
                            {
                                $divide: [
                                    "$total_nights_booked",
                                    "$days_in_month"
                                ]
                            },
                            100
                        ]
                    },
                    0
                ]
            }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1
        }
    },
    {
        $unionWith: {
            pipeline: [
                {
                    $documents: Array.from({ length: Math.ceil((e_date - firstOfMonth) / (30 * 24 * 60 * 60 * 1000)) }, (_, i) => {
                        const date = new Date(firstOfMonth);
                        date.setMonth(date.getMonth() + i);
                        return {
                            _id: {
                                year: date.getUTCFullYear(),
                                month: date.getUTCMonth() + 1
                            },
                            total_nights_booked: 0,
                            days_in_month: new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).getDate(),
                            occupancy_percentage: 0
                        };
                    })
                }
            ]
        }
    },
    {
        $group: {
            _id: "$_id",
            total_nights_booked: { $sum: "$total_nights_booked" },
            days_in_month: { $first: "$days_in_month" },
            occupancy_percentage: { $first: "$occupancy_percentage" }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1
        }
    }
    
];

export {
    getDaysInMonth,
    getOccupancyAggregation
};