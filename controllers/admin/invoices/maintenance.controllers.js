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
      .populate("property_id")
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
    const maintenanceRecords = await MaintenanceInvoiceModal.find({})
      .populate("property_id")
      .populate("bank_details");
    res.status(200).json(maintenanceRecords);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(200).json(updatedMaintenance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
