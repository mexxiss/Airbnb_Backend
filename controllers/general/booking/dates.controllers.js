import { BookedDatesModel } from "../../../models/BookedDates.js";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { UtilityModel } from "../../../models/Utility.js";
import { generateReservationCode } from "../../../utils/commons.js";
import mongoose from "mongoose";

export const GetBookedDates = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Get all booked dates for a property"
  // #swagger.description = "> #TODO: Retrieved documents are being sent back through response that may contain unnecessary information",

  try {
    const { property } = req.query;

    if (!property || !mongoose.isValidObjectId(property)) {
      return next(new apiError(400, "Property id not provided or invalid"));
    }

    const query = { checkout_date: { $gte: new Date() }, property: property };

    const dates = await BookedDatesModel.find(query).select("checkin_date checkout_date -_id");

    const formattedDates = dates.map((date) => ({
      from: date.checkin_date.toISOString().split("T")[0],
      to: date.checkout_date.toISOString().split("T")[0],
    }));

    return res
      .status(200)
      .json(new apiResponse(200, formattedDates, "Booked dates retrieved successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const SetBookedDates = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Set booked dates or reserve dates for a property"
  // #swagger.description = "> #TODO: Created document is being sent back through response that may contain unnecessary information",
  /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/BookedDatesRequest" }  
                }
            }
        }
    */

  const { checkin_date, checkout_date, property, book_details, source } =
    req.body;

  const reservationCode = generateReservationCode();

  const checkinDateISO = new Date(checkin_date).toISOString();
  const checkoutDateISO = new Date(checkout_date).toISOString();

  try {
    const propertyDoc = await PropertiesModel.findById(property);
    if (!propertyDoc) {
      return next(new apiError(400, "Property not found"));
    }

    const utility = await UtilityModel.findOne();
    if (!utility) {
      return next(new apiError(400, "Utility Document Error"));
    }

    const bookedDates = new BookedDatesModel({
      checkin_date: checkinDateISO,
      checkout_date: checkoutDateISO,
      property,
      book_details,
      source,
      reservationCode,
    });
    bookedDates.nights_count = await bookedDates.getNightsCount(
      checkin_date,
      checkout_date
    );
    bookedDates.cost_details = await propertyDoc.calculateCosts(
      bookedDates.nights_count,
      bookedDates.discount,
      utility.vat_tax_rate,
      utility.tourism_tax_rate
    );

    await bookedDates.save();
    return res
      .status(200)
      .json(new apiResponse(200, bookedDates, "Dates Booked"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const calculateCosts = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Calculate costs for booked dates"
  // #swagger.description = "> #TODO: Calculated costs are being sent back through response that may contain unnecessary information",

  const { checkin, checkout, property } = req.query;
  try {
    const doc = await PropertiesModel.findById(property);
    if (!doc) {
      return next(new apiError(400, "Property not found"));
    }

    const nights_count = await doc.getNightsCount(checkin, checkout);
    const costs = await doc.calculateCosts(nights_count, 0, 5, 6);

    const data = {
      nights_count,
      stay_charges: costs.stay_charges,
      discount: costs.discount,
      cleaning_fee: costs.cleaning_fee,
      tourism_tax: costs.tourism_tax,
      vat_tax: costs.vat_tax,
      net_charges: costs.net_charges,
    }

    return res
      .status(200)
      .json(new apiResponse(200, data, "Costs calculated successfully"));
  } catch (err) {
    next(new apiError(500, `Server Error: ${err}`));
  }
}

// export const GetBookedDatesforBooking = async (req, res, next) => {
//   // #swagger.tags = ['General']
//   // #swagger.summary = "Get booked dates for a property that can be booked"
//   // #swagger.description = "> #TODO: Retrieved documents are being sent back through response that may contain unnecessary information",

//   const { property } = req.query;
//   if (!property || !mongoose.isValidObjectId(property)) {
//     return next(new apiError(400, "Property id not provided or invalid"));
//   }

//   const query = { checkout_date: { $gte: new Date() }, property: property };

//   const dates = await BookedDatesModel.find(query);
//   try {
//     const bookedDates = await BookedDatesModel.find()
//   }
// }