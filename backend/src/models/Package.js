import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    images: [String],

    category: {
      type: String,
      enum: ["adventure", "cultural", "wildlife", "weekend", "budget", "family"],
      required: true
    },

    durationDays: Number,
    pricePerPerson: Number,

    itinerary: [String],
    inclusions: [String],
    exclusions: [String],

    providerName: String,
    providerWebsite: String,
    providerType: String,

    bookNowUrl: { type: String, required: true },

    rating: { type: Number, default: 4.2 },

    isActive: { type: Boolean, default: true },

    // Approval System
    isApproved: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // New Fields for Detailed UI
    highlights: [String],
    accommodation: String,
    sustainableImpact: String,
    packingList: [String],
    faqs: [{
      question: String,
      answer: String
    }],
    cancellationPolicy: String,
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Package = mongoose.model("Package", packageSchema);
