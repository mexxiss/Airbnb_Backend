import { BookedDatesModel } from "../../../models/BookedDates.js";
import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { generateReservationCode } from "../../../utils/commons.js";
import { BookDetailsModel } from "../../../models/BookDetails.js";

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

export const GetSingleBookedDate = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Get a single booked date for a property within a date range"
  // #swagger.description = "> Retrieve a single booking that overlaps with the given date range for a property."

  /*
    #swagger.parameters['property'] = {
      in: 'query',
      description: 'ID of the property to fetch the booked date',
      required: true,
      type: 'string'
    }
    
  */

  const { doc_id } = req.query;

  if (!doc_id) {
    return next(new apiError(400, "booking dates ID, are required"));
  }

  try {
    // const checkinDateISO = new Date(checkin_date).toISOString();
    // const checkoutDateISO = new Date(checkout_date).toISOString();

    // Find a single document where the date range overlaps
    const bookedDate = await BookedDatesModel.findById(doc_id);
    // const bookedDate = await BookedDatesModel.findOne({
    //   doc_id,
    //   // $or: [
    //   //   {
    //   //     $and: [
    //   //       { checkin_date: { $lte: checkinDateISO } },
    //   //       { checkout_date: { $gte: checkinDateISO } },
    //   //     ],
    //   //   },
    //   //   {
    //   //     $and: [
    //   //       { checkin_date: { $lte: checkoutDateISO } },
    //   //       { checkout_date: { $gte: checkoutDateISO } },
    //   //     ],
    //   //   },
    //   //   {
    //   //     $and: [
    //   //       { checkin_date: { $gte: checkinDateISO } },
    //   //       { checkout_date: { $lte: checkoutDateISO } },
    //   //     ],
    //   //   },
    //   // ],
    // }).lean();

    if (!bookedDate) {
      return res
        .status(404)
        .json(
          new apiResponse(
            404,
            null,
            "No booking found for the specified criteria"
          )
        );
    }

    return res
      .status(200)
      .json(new apiResponse(200, bookedDate, "Booking retrieved successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

export const SetBlockedDates = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Set or update booked dates or reserve dates for a property"
  // #swagger.description = "> Handles both creation and updating of booked/blocked dates for a property."

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
    book_details,
  } = req.body;

  const reservationCode = generateReservationCode();

  // Parse dates to ISO strings
  const checkinDateISO = new Date(checkin_date).toISOString();
  const checkoutDateISO = new Date(checkout_date).toISOString();

  try {
    // Ensure the property exists
    const propertyDoc = await PropertiesModel.findById(property);
    if (!propertyDoc) {
      return next(new apiError(400, "Property not found"));
    }

    // Check for overlapping dates
    const overlappingRecord = await BookedDatesModel.findOne({
      property,
      $or: [
        {
          $and: [
            { checkin_date: { $lte: checkinDateISO } },
            { checkout_date: { $gte: checkinDateISO } },
          ],
        },
        {
          $and: [
            { checkin_date: { $lte: checkoutDateISO } },
            { checkout_date: { $gte: checkoutDateISO } },
          ],
        },
        {
          $and: [
            { checkin_date: { $gte: checkinDateISO } },
            { checkout_date: { $lte: checkoutDateISO } },
          ],
        },
      ],
    });

    if (overlappingRecord) {
      // Update the existing record
      overlappingRecord.checkin_date = checkinDateISO;
      overlappingRecord.checkout_date = checkoutDateISO;
      overlappingRecord.source = source || overlappingRecord.source;
      overlappingRecord.access_card_keys =
        access_card_keys || overlappingRecord.access_card_keys;
      overlappingRecord.book_details =
        book_details || overlappingRecord.book_details;
      overlappingRecord.note = note || overlappingRecord.note;

      await overlappingRecord.save();

      return res
        .status(200)
        .json(new apiResponse(200, overlappingRecord, "Dates Updated"));
    } else {
      // Create a new record
      const newRecord = new BookedDatesModel({
        checkin_date: checkinDateISO,
        checkout_date: checkoutDateISO,
        property,
        source,
        reservationCode,
        access_card_keys,
        book_details,
        note,
      });

      await newRecord.save();

      return res
        .status(201)
        .json(new apiResponse(201, newRecord, "Dates Booked"));
    }
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

export const SetOwnerBookDetails = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Save or update booking details based on property_id"
  // #swagger.description = "> Save new booking details or update existing ones based on property_id."
  /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/BookDetailsRequest" }  
                }
            }
        }
    */
  const {
    property,
    first_name,
    last_name,
    email,
    guests,
    phone_number,
    message,
    promo_code,
    newsletter_agree,
  } = req.body;

  try {
    let details = await BookDetailsModel.findOne({
      property,
    });

    if (details) {
      details = await BookDetailsModel.findOneAndUpdate(
        {
          property,
        },
        {
          first_name,
          last_name,
          email,
          guests,
          phone_number,
          message,
          promo_code,
          newsletter_agree,
          property,
        },
        { new: true }
      );

      return res
        .status(200)
        .json(
          new apiResponse(200, details, "Booking Details updated successfully.")
        );
    } else {
      details = await BookDetailsModel.create({
        property,
        first_name,
        last_name,
        email,
        guests,
        phone_number,
        message,
        promo_code,
        newsletter_agree,
      });

      return res
        .status(200)
        .json(
          new apiResponse(200, details, "Booking Details saved successfully.")
        );
    }
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};

export const deleteBookedDate = async (req, res, next) => {
  const { doc_id } = req.query;

  if (!doc_id) {
    return next(new apiError(400, "booking dates ID, are required"));
  }

  try {
    // Find and remove the document matching the `from` and `to` dates
    const deletedDate = await BookedDatesModel.findByIdAndDelete(doc_id);

    if (!deletedDate) {
      return next(new apiError(404, "Booked date not found"));
    }

    return res.status(200).json(new apiResponse(200, "Booked date deleted"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};
