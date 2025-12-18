import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    title: String,
    imageUrl: { type: String, required: true },
    category: String,
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
