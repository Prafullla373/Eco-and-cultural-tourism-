import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: String,
    experience: String,
    languages: [String],
    phone: String,
    photo: String,
    rating: { type: Number, default: 4.5 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Guide = mongoose.model("Guide", guideSchema);
