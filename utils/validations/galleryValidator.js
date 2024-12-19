const galleryValidator = (req, res, next) => {
  try {
    const { type, img_url } = req.body;
    
    if (!type && !mongoose.isValidObjectId(type)) {
      return res.status(400).json({
        msg: "Type is not passed correctly",
        key: "type",
      });
    }
    if (!img_url || !/^https?:\/\/res\.cloudinary\.com\/.+/.test(img_url)) {
      return res.status(400).json({
        msg: "img_url is required",
        key: "img_url",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export default galleryValidator;
