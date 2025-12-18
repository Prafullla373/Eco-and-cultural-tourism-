import mongoose from "mongoose";

const cultureItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["tribal_dance", "art", "handicraft", "festival", "tradition"],
      required: true
    },
    description: String,
    images: [String],
    origin: String,
    district: String,
    videoUrl: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CultureItem = mongoose.model("CultureItem", cultureItemSchema);
