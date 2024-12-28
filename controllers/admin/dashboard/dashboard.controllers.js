import { BookedDatesModel } from "../../../models/BookedDates.js";
import { PropertiesModel } from "../../../models/Properties.js";
import { UserModel } from "../../../models/Users.js";
import { apiError } from "../../../utils/apiError.js";
import { getPropertiesChartData } from "../../../utils/dashboard/propertieschart.js";
import { getUsersChartsData } from "../../../utils/dashboard/userstatus.js";

export const getFigures = async (req, res, next) => {
    try {
        // Total USERS (example placeholder)
        const usersCount = await UserModel.countDocuments();

        // Count active properties
        const totalPropertiesCount = await PropertiesModel.countDocuments();
        const activePropertiesCount = await PropertiesModel.countDocuments({ status: "Active" });
        const inactivePropertiesCount = await PropertiesModel.countDocuments({ status: "Inactive" });

        // Leading cities by bookings
        const cityBookings = await BookedDatesModel.aggregate([
            {
                $lookup: {
                    from: "properties", // Collection name for properties
                    localField: "property",
                    foreignField: "_id",
                    as: "propertyDetails",
                },
            },
            {
                $unwind: "$propertyDetails", // Flatten the property details
            },
            {
                $group: {
                    _id: "$propertyDetails.address.city", // Group by city
                    bookingsCount: { $sum: 1 }, // Count the number of bookings
                },
            },
            {
                $sort: { bookingsCount: -1 }, // Sort by bookings count in descending order
            },
        ]);

        const totalBookings = cityBookings.reduce((sum, city) => sum + city.bookingsCount, 0);

        const formattedCities = cityBookings.slice(0, 4).map((city, index) => ({
            name: city._id || "Unknown",
            percentage: ((city.bookingsCount / totalBookings) * 100).toFixed(2),
        }));

        const otherBookingsCount = cityBookings
            .slice(4)
            .reduce((sum, city) => sum + city.bookingsCount, 0);
        if (otherBookingsCount > 0) {
            formattedCities.push({
                name: "Others",
                percentage: ((otherBookingsCount / totalBookings) * 100).toFixed(2),
            });
        }

        const figures = {
            totalUsers: usersCount,
            activeProperties: activePropertiesCount,
            leadingCities: formattedCities,
            totalBookings: totalBookings,
            totalProperties: totalPropertiesCount,
            inactiveProperties: inactivePropertiesCount,
            usersChart: await getUsersChartsData(),
            propertiesChart: await getPropertiesChartData()
        };

        return res.status(200).json(figures);
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error.message}`));
    }
};
