import { PropertyUtilitiesManagerModel } from "../models/PropertyUtilitiesManager";

const createPropertyUtilitiesManager = async (req, res) => {
  try {
    const { utility_name, manage_allow, property, user_id, utility_id } =
      req.body;

    const newUtilityManager = new PropertyUtilitiesManagerModel({
      utility_name,
      manage_allow,
      property,
      user_id,
      utility_id,
    });

    const savedUtilityManager = await newUtilityManager.save();
    res.status(201).json({
      message: "Utility manager created successfully",
      data: savedUtilityManager,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating utility manager", error });
  }
};

const GetPropertyUtilitiesManager = async (req, res) => {
  try {
    const { property, user_id } = req.query;

    const filter = {};
    if (property) filter.property = property;
    if (user_id) filter.user_id = user_id;

    const utilityManagers = await PropertyUtilitiesManagerModel.find(filter)
      .populate("property")
      .populate("user_id")
      .populate("utility_id");

    res.status(200).json({ data: utilityManagers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving utility managers", error });
  }
};
