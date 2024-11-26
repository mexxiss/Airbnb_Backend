import { BookedDatesModel } from "../models/BookedDates.js";
import { PropertiesModel } from "../models/Properties.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { UtilityModel } from "../models/Utility.js";

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

export const SetBookedDates = async(req, res, next) => {
    const {checkin_date, checkout_date, property} = req.body;

    try {
        const propertyDoc = await PropertiesModel.findById(property);
        if(!propertyDoc) {
            return next(new apiError(400, "Property not found"));
        }

        const utility = await UtilityModel.findOne();
        if(!utility) {
            return next(new apiError(400, "Utility Document Error"));
        }

        const bookedDates = new BookedDatesModel({checkin_date, checkout_date, property});
        bookedDates.nights_count = await bookedDates.getNightsCount(checkin_date, checkout_date);
        bookedDates.cost_details = await propertyDoc.calculateCosts(bookedDates.nights_count, bookedDates.discount, utility.vat_tax_rate, utility.tourism_tax_rate);

        await bookedDates.save();
        return res.status(200).json(new apiResponse(200, bookedDates, "Dates Booked"))
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}