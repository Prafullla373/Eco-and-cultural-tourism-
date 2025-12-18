import { Location } from "../models/Location.js";

// Create/Update/Delete are handled by locationController for Admin Panel.
// We keep these here just in case, but mapped to Location.

export const createExploreItem = async (req, res) => {
  try {
    const item = await Location.create({
      ...req.body,
      createdBy: req.user ? req.user._id : undefined,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Failed to create item", error: err.message });
  }
};

export const getExploreItems = async (req, res) => {
  try {
    const { category, location, minRating, search } = req.query;
    const filter = { isActive: true, isApproved: true }; // Only show active & approved

    if (category && category !== "All") {
      // Map frontend 'Category' to backend 'type' if needed, or assume frontend sends correct types
      // Frontend sends Title Case (e.g. "Eco Tourism"), Backend uses lowercase/snake_case (e.g. "eco")
      // We'll try to match loosely or expects frontend to send correct values.
      // For now, let's try to map common ones or use regex for case-insensitivity
      filter.type = { $regex: new RegExp(`^${category.replace(" ", "_")}$`, "i") };
    }
    if (location && location !== "All") {
      filter.district = location;
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const items = await Location.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
};

export const getExploreItemById = async (req, res) => {
  try {
    const item = await Location.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch item", error: err.message });
  }
};

export const updateExploreItem = async (req, res) => {
  try {
    const item = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Failed to update item", error: err.message });
  }
};

export const deleteExploreItem = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
};

export const addExploreReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const item = await Location.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const already = item.reviews.find(
      (r) => r.user && r.user.toString() === req.user._id.toString()
    );
    if (already) {
      return res.status(400).json({ message: "You already reviewed this place" });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name || req.user.email,
      rating: Number(rating),
      comment,
    };

    item.reviews.push(review);
    item.numReviews = item.reviews.length;
    item.rating =
      item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length;

    await item.save();

    res.status(201).json({
      message: "Review added",
      review,
      rating: item.rating,
      numReviews: item.numReviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add review", error: err.message });
  }
};

export const logExploreRedirect = async (req, res) => {
  try {
    const item = await Location.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.redirectClicks = (item.redirectClicks || 0) + 1;
    await item.save();
    res.json({ message: "Redirect logged" });
  } catch (err) {
    res.status(500).json({ message: "Failed to log redirect", error: err.message });
  }
};