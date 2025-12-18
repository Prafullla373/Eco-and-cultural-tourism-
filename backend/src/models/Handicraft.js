import mongoose from "mongoose";

const handicraftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artisanName: String,
    district: String,
    description: String,
    category: String,
    images: [String],
    material: String,
    priceRange: String,
    contact: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Handicraft = mongoose.model("Handicraft", handicraftSchema);
