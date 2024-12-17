import { PropertiesModel } from "../../../models/Properties.js";

const getPropertyListByAdmin = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const properties = await PropertiesModel.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProperties = await PropertiesModel.countDocuments({});
    res.status(200).json({
      data: properties,
      currentPage: page,
      totalPages: Math.ceil(totalProperties / limit),
      totalProperties,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
};

export { getPropertyListByAdmin };
