const amenitiesValidator = (req, res, next) => {
  try {
    const { title, icon } = req.body;
    if (!title) {
      return res.status(400).json({
        mag: "title is required",
        key: "title",
      });
    }
    if (!icon) {
      return res.status(400).json({
        mag: "icon is required",
        key: "icon",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

export default amenitiesValidator;
