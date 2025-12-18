import mongoose from "mongoose";

const wildlifeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["animal", "bird", "reptile"],
      required: true
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    description: String,
    images: [String],

    dangerLevel: {
      type: String,
      enum: ["safe", "medium", "danger"],
      default: "safe"
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Wildlife = mongoose.model("Wildlife", wildlifeSchema);
