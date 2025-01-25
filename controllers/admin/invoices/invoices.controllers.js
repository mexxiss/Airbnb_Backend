import path from "path";
import fs from "fs";
import * as pdf from "html-pdf-node";
import { fileURLToPath } from "url";
import { cloudinary } from "../../../uploads/cloudinary.js";
import { MonthalySchemaModal } from "../../../models/Invoices.js";
import { BookedDatesModel } from "../../../models/BookedDates.js";
import mongoose from "mongoose";
import { PropertiesModel } from "../../../models/Properties.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePdf = async (req, res) => {
  try {
    // Paths
    const htmlPath = path.join(
      __dirname,
      "../../../public/invoice_templates/statement.html"
    );
    const html = fs.readFileSync(htmlPath, "utf-8");

    // Generate data
    const data = req.body.data || [];
    const array = data.map((d) => ({
      name: d.name,
      description: d.description,
      unit: d.unit,
      quantity: d.quantity,
      price: d.price,
      total: d.quantity * d.price,
      imgurl: d.imgurl,
    }));

    const subtotal = array.reduce((sum, i) => sum + i.total, 0);
    const tax = (subtotal * 20) / 100;
    const grandtotal = subtotal - tax;

    const obj = {
      prodlist: array,
      subtotal,
      tax,
      gtotal: grandtotal,
    };

    const filename = `${Date.now()}_invoice.pdf`;
    const tempPath = path.join(__dirname, `../../../temp/${filename}`);
    const document = {
      content: html,
      data: { products: obj },
    };

    // Generate PDF
    const pdfBuffer = await pdf.generatePdf(document, {
      format: "A4",
      margin: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    });

    // Save the PDF temporarily
    fs.writeFileSync(tempPath, pdfBuffer);

    // Upload to Cloudinary
    cloudinary.uploader
      .upload_stream(
        {
          folder: "invoices",
          resource_type: "raw",
          public_id: filename,
          format: "pdf",
        },
        (error, result) => {
          fs.unlink(tempPath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });

          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res
              .status(500)
              .json({ message: "Error uploading PDF", error });
          }

          res.status(200).json({
            message: "PDF generated and uploaded successfully",
            url: result.secure_url,
          });
        }
      )
      .end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
};

export const createOrUpdateMonthlyInvoice = async (req, res) => {
  try {
    const { statementPeriod } = req.body.invoiceDetails;
    const { property_id } = req.body;

    if (!property_id) {
      return res
        .status(400)
        .json({ message: "Property ID is required to process the invoice." });
    }

    const propertyId = mongoose.Types.ObjectId.isValid(property_id)
      ? property_id
      : null;

    if (!propertyId) {
      return res.status(400).json({
        message: "Invalid Property ID format.",
      });
    }

    const existingInvoice = await MonthalySchemaModal.findOne({
      "invoiceDetails.statementPeriod": statementPeriod,
      property_id: propertyId,
    });

    if (existingInvoice) {
      const updatedInvoice = await MonthalySchemaModal.findByIdAndUpdate(
        existingInvoice._id,
        req.body,
        { new: true }
      );

      return res.status(200).json({
        message: "Invoice updated successfully!",
        data: updatedInvoice,
      });
    }

    // Create a new invoice
    const newInvoice = new MonthalySchemaModal(req.body);
    await newInvoice.save();

    res.status(201).json({
      message: "Invoice created successfully!",
      data: newInvoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing invoice",
      error: error.message,
    });
  }
};

export const getmonthalyRevenueDetail = async (req, res) => {
  try {
    const { property_id, user_id, target_month } = req.query;

    let startDate, endDate;
    if (target_month) {
      const [year, month] = target_month.split("-").map(Number);
      if (!year || !month || month < 1 || month > 12) {
        return res
          .status(400)
          .json({ error: "Invalid target_month format. Use YYYY-MM." });
      }
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const filter = {
      checkin_date: { $gte: startDate },
      checkout_date: { $lte: endDate },
    };

    if (property_id) {
      if (!mongoose.Types.ObjectId.isValid(property_id.trim())) {
        return res.status(400).json({ error: "Invalid property_id format" });
      }
      filter.property = new mongoose.Types.ObjectId(property_id.trim());
    }

    if (user_id) {
      if (!mongoose.Types.ObjectId.isValid(user_id.trim())) {
        return res.status(400).json({ error: "Invalid user_id format" });
      }
      const propertyOwned = await PropertiesModel.find({
        user: user_id.trim(),
      });
      if (!propertyOwned.length) {
        return res
          .status(404)
          .json({ error: "No properties found for the given user_id." });
      }
      filter.property = { $in: propertyOwned.map((p) => p._id) };
    }

    const bookings = await BookedDatesModel.find(filter)
      .populate("property", "title")
      .populate("book_details", "first_name last_name email");

    // if (!bookings.length) {
    //   return res
    //     .status(200)
    //     .json({ error: "No bookings found for the given criteria." });
    // }

    const reservations = bookings.map((booking) => ({
      reservationCode: booking.reservationCode,
      guestName:
        `${booking.book_details?.first_name} ${booking.book_details?.last_name}` ||
        "N/A",
      checkIn: booking.checkin_date.toISOString().split("T")[0],
      checkOut: booking.checkout_date.toISOString().split("T")[0],
      totalNights: booking.nights_count,
      netRentalIncome: booking.cost_details.net_charges,
    }));

    const totalIncome = reservations.reduce(
      (sum, reservation) => sum + reservation.netRentalIncome,
      0
    );

    const managementFeePercentage = 17;
    const managementFee = {
      percentage: managementFeePercentage,
      amount: (totalIncome * managementFeePercentage) / 100,
    };

    const expenses = [
      {
        description: "DET License Fee",
        amount: 370,
      },
    ];

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const netAmountDue = totalIncome - managementFee.amount;

    const invoiceDetails = {
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      statementPeriod: `${startDate.getFullYear()}/${startDate.getMonth() + 1}`,
    };

    res.json({
      invoiceDetails,
      reservations,
      summary: {
        totalIncome,
        managementFee,
        expenses,
        netAmountDue,
      },
      footer: "Kind regards,\nMexxstates",
    });
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    res.status(500).json({ error: "Failed to fetch revenue data." });
  }
};

export const getmonthalyRevenueList = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { "companyDetails.name": { $regex: search, $options: "i" } },
          { "companyDetails.address": { $regex: search, $options: "i" } },
          { "companyDetails.phone": { $regex: search, $options: "i" } },
          { "ownerDetails.name": { $regex: search, $options: "i" } },
          { "ownerDetails.address": { $regex: search, $options: "i" } },
          { "ownerDetails.phone": { $regex: search, $options: "i" } },
          { "invoiceDetails.invoiceNumber": { $regex: search, $options: "i" } },
          {
            "invoiceDetails.statementPeriod": { $regex: search, $options: "i" },
          },
          { "reservations.guestName": { $regex: search, $options: "i" } },
          { "reservations.reservationCode": { $regex: search, $options: "i" } },
          { footer: { $regex: search, $options: "i" } },
        ],
      };

      // Check if summary fields are numeric before querying
      if (!isNaN(search)) {
        query.$or.push(
          { "summary.totalIncome": search },
          { "summary.managementFee.amount": search },
          { "summary.netAmountDue": search }
        );
      }
    }

    const revenueInvoiceLists = await MonthalySchemaModal.find(query);

    res.status(200).json({
      message: "Revenue details fetched successfully.",
      data: revenueInvoiceLists,
    });
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    res.status(500).json({ error: "Failed to fetch revenue data." });
  }
};
