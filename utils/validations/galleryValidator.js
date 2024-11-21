const galleryValidator = (req, res, next) => {
  try {
    const { key, img_url } = req.body;
    if (!key) {
      return res.status(400).json({
        mag: "key is required",
        key: "key",
      });
    }
    if (!img_url) {
      return res.status(400).json({
        mag: "img_url is required",
        key: "img_url",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

export default galleryValidator;
