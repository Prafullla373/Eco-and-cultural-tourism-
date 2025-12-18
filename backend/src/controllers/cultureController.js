import Culture from "../models/Culture.js";

// @desc    Get all culture items
// @route   GET /api/culture
// @access  Public
export const getAllCulture = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const cultureItems = await Culture.find(query).sort({ createdAt: -1 });
    res.status(200).json(cultureItems);
  } catch (error) {
    console.error("Error fetching culture items:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single culture item by ID
// @route   GET /api/culture/:id
// @access  Public
export const getCultureById = async (req, res) => {
  try {
    const item = await Culture.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Culture item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching culture item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
