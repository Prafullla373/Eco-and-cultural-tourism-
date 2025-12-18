import { User } from "../models/User.js";

// Get all guides with filters
export const getGuides = async (req, res) => {
  try {
    const { district, expertise, availability } = req.query;

    // Build query
    // Assuming 'local_guide' is the role, or we check for existence of guide fields
    // Let's assume we filter by role "local_guide" or similar if defined, 
    // OR we just look for users who have 'experienceYears' set (implying they registered as guide)
    // Based on User.js, role is enum. Let's assume "local_guide" is a valid role or we add it.
    // For now, let's query users where `role` is 'local_guide' OR `experienceYears` exists.

    const query = {
      $or: [{ role: "local_guide" }, { experienceYears: { $exists: true, $ne: null } }]
    };

    if (district && district !== "All") query.district = district;
    if (availability && availability !== "All") query.availability = availability;
    if (expertise && expertise !== "All") query.expertise = { $in: [expertise] };

    const guides = await User.find(query)
      .select("-password") // Exclude password
      .sort({ createdAt: -1 });

    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch guides", error: error.message });
  }
};

// Get guide details
export const getGuideById = async (req, res) => {
  try {
    const guide = await User.findById(req.params.id).select("-password");
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch guide", error: error.message });
  }
};

// Update availability (for the guide themselves)
export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update availability", error: error.message });
  }
};
