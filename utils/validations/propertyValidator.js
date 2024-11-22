export const propertyValidator = (req, res, next) => {
  const requiredFields = [
    "title",
    "description",
    "images",
    "pricePerNight",
    "guests",
    "rooms",
    "beds",
    "important_information",
    "check_in",
    "check_out",
    "weekly_discount",
    "monthly_discount",
    "security_deposit",
    "price",
    "staying_rules",
    "cleaning_fee",
    "vat_tax",
    "tourism_tax",
    "location",
    "host_by",
    "availability",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }

  if (!Array.isArray(req.body.images) || req.body.images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  // Validate availability dates
  const { availability } = req.body;
  if (availability) {
    if (new Date(availability.startDate) >= new Date(availability.endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date.",
      });
    }
  }

  next();
};
