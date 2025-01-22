import { MaintenanceInvoiceModal } from "../../../models/Invoices.js";
import { PropertiesModel } from "../../../models/Properties.js";
import {
  generateDynamicStringFromPropertyName,
  generateUAE_TRN,
} from "../../../utils/commons.js";

export const CreateMaintenance = async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can create a new maintenance invoice"
  const {
    property_id,
    essentialWorksImages,
    amountOwedToFP,
    bank_details,
    companyDetails,
    essentialWorks,
    notes,
    ownerDetails,
    receivedAmount,
    statementPeriod,
    subtotal,
    tax,
    totalMaintenceCost,
  } = req.body;

  if (!property_id) {
    return res.status(400).json({ message: "property_id are required" });
  }

  const property = await PropertiesModel.findById(property_id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  try {
    const maintenance = new MaintenanceInvoiceModal({
      property_id,
      essentialWorksImages,
      amountOwedToFP,
      bank_details,
      companyDetails,
      essentialWorks,
      notes,
      ownerDetails,
      receivedAmount,
      statementPeriod,
      subtotal,
      tax,
      totalMaintenceCost,
      taxInvoiceNumber: generateDynamicStringFromPropertyName(
        "INV",
        "M",
        property.title,
        statementPeriod
      ),
      trn_number: generateUAE_TRN(),
    });
    await maintenance.save();
    res.status(201).json({
      message: "Maintenance Invoice Created successfully",
      data: maintenance,
    });
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: error.message });
  }
};

export const GetMaintenanceInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await MaintenanceInvoiceModal.findById(id)
      .populate({
        path: "property_id",
        select: "title user",
      })
      .populate("bank_details");
    if (!maintenance) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    res
      .status(200)
      .json({ message: "fetched successfully", data: maintenance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const GetMaintenanceInvoiceList = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { statementPeriod: { $regex: search, $options: "i" } },
          { trn_number: { $regex: search, $options: "i" } },
          { taxInvoiceNumber: { $regex: search, $options: "i" } },
          { "companyDetails.name": { $regex: search, $options: "i" } },
          { "companyDetails.address": { $regex: search, $options: "i" } },
          { "companyDetails.phone": { $regex: search, $options: "i" } },
          { "ownerDetails.name": { $regex: search, $options: "i" } },
          { "ownerDetails.address": { $regex: search, $options: "i" } },
          { "ownerDetails.phone": { $regex: search, $options: "i" } },
          { "essentialWorks.itemService": { $regex: search, $options: "i" } },
          {
            "essentialWorksImages.work_name": { $regex: search, $options: "i" },
          },
          { notes: { $regex: search, $options: "i" } },
        ],
      };

      // Handle numeric fields separately
      if (!isNaN(search)) {
        const searchNumber = Number(search); // Convert the search term to a number

        query.$or.push(
          { subtotal: { $gte: searchNumber } },
          { totalMaintenceCost: { $gte: searchNumber } },
          { receivedAmount: { $gte: searchNumber } },
          { amountOwedToFP: { $gte: searchNumber } }
        );
      }
    }

    const maintenanceRecords = await MaintenanceInvoiceModal.find(query)
      .populate({
        path: "property_id",
        select: "title user",
      })
      .populate("bank_details");

    res.status(200).json({
      message: "Maintenance invoices fetched successfully.",
      data: maintenanceRecords,
    });
  } catch (error) {
    console.error("Error fetching maintenance invoices:", error);
    res.status(400).json({ error: "Failed to fetch maintenance invoices." });
  }
};

export const UpdateMaintenanceInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMaintenance = await MaintenanceInvoiceModal.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedMaintenance) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    res.status(200).json({ data: updatedMaintenance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
