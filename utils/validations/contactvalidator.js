const contactValidator = (req, res, next) => {
  try {
    const { emails, phones, location } = req.body;
    if (!emails) {
      return res.status(400).json({
        mag: "emails is required",
        key: "emails",
      });
    }
    if (!phones) {
      return res.status(400).json({
        mag: "phones is required",
        key: "phones",
      });
    }
    if (!location) {
      return res.status(400).json({
        mag: "location is required",
        key: "location",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

export default contactValidator;
