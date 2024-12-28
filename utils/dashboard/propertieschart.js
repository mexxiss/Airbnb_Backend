import { PropertiesModel } from "../../models/Properties.js";
import { startOfDay, endOfDay, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from "date-fns";

export const getPropertiesChartData = async () => {
    try {
        const currentDate = new Date();

        // Weekly data
        const weeklyData = await Promise.all(
            Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() - (6 - i)); // Last 7 days

                return PropertiesModel.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: startOfDay(date),
                                $lte: endOfDay(date),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }, // Count users created
                        },
                    },
                ]).then((result) => ({
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                    total: result.length > 0 ? result[0].total : 0,
                }));
            })
        );

        // Monthly data
        const monthlyData = await Promise.all(
            Array.from({ length: 12 }, (_, i) => {
                const date = new Date(currentDate);
                date.setMonth(currentDate.getMonth() - (11 - i)); // Last 6 months

                return PropertiesModel.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: startOfMonth(date),
                                $lte: endOfMonth(date),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }, // Count users created
                        },
                    },
                ]).then((result) => ({
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    total: result.length > 0 ? result[0].total : 0,
                }));
            })
        );

        // Yearly data
        const yearlyData = await Promise.all(
            Array.from({ length: 3 }, (_, i) => {
                const year = currentDate.getFullYear() - (2 - i); // Last 3 years

                return PropertiesModel.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: startOfYear(new Date(year, 0, 1)),
                                $lte: endOfYear(new Date(year, 11, 31)),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }, // Count users created
                        },
                    },
                ]).then((result) => ({
                    year,
                    total: result.length > 0 ? result[0].total : 0,
                }));
            })
        );

        return {
            weekly: weeklyData,
            monthly: monthlyData,
            yearly: yearlyData,
        };
    } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch user charts data");
    }
};