import { BookedDatesModel } from "../../../models/BookedDates.js";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { UtilityModel } from "../../../models/Utility.js";
import { generateReservationCode } from "../../../utils/commons.js";

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

    const dates = await BookedDatesModel.find(query);

    return res
      .status(200)
      .json(new apiResponse(200, dates, "Booked dates retrieved successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const SetBlockedDates = async (req, res, next) => {
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

  const {
    checkin_date,
    checkout_date,
    property,
    source,
    note,
    access_card_keys,
  } = req.body;

  const reservationCode = generateReservationCode();
  console.log({ checkin_date });
  console.log({ checkout_date });

  const checkinDateISO = new Date(checkin_date).toISOString();
  const checkoutDateISO = new Date(checkout_date).toISOString();

  try {
    const propertyDoc = await PropertiesModel.findById(property);
    if (!propertyDoc) {
      return next(new apiError(400, "Property not found"));
    }

    const bookedDates = new BookedDatesModel({
      checkin_date: checkinDateISO,
      checkout_date: checkoutDateISO,
      property,
      source,
      reservationCode,
      access_card_keys,
      note,
    });

    await bookedDates.save();
    return res
      .status(200)
      .json(new apiResponse(200, bookedDates, "Dates Booked"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
