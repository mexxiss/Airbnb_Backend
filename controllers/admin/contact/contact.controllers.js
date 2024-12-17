import { ContactUsModel } from "../../../models/ContactUs.js";

export const updateContactUs = async (req, res) => {
    // #swagger.tags = ['Admin']
    try {
      const allowedItems = ["emails", "phones", "location"];
  
      const updates = Object.keys(req.body).filter((key) =>
        allowedItems.includes(key)
      );
  
      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid fields provided for update.",
        });
      }
  
      const contact = await ContactUsModel.findById(req?.params?.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact details not found.",
        });
      }
  
      updates.forEach((key) => {
        // Handle nested updates for location
        if (key === "location" && typeof req.body.location === "object") {
          contact.location = {
            ...contact.location,
            ...req.body.location,
          };
        } else {
          contact[key] = req.body[key];
        }
      });
  
      const updatedContact = await contact.save();
  
      res.status(200).json({
        success: true,
        message: "Contact details updated successfully.",
        data: updatedContact,
      });
    } catch (error) {
      console.error("Error updating contact details:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  