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
const contactQuerySendValidator = (req, res, next) => {
  try {
    const { fullname, email, phone, subject, message } = req.body;
    if (!fullname) {
      return res.status(400).json({
        mag: "fullname is required",
        key: "fullname",
      });
    }
    if (!email) {
      return res.status(400).json({
        mag: "email is required",
        key: "email",
      });
    }
    if (!phone) {
      return res.status(400).json({
        mag: "phone is required",
        key: "phone",
      });
    }
    if (!subject) {
      return res.status(400).json({
        mag: "subject is required",
        key: "subject",
      });
    }
    if (!message) {
      return res.status(400).json({
        mag: "message is required",
        key: "message",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

export { contactValidator, contactQuerySendValidator };
