import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },

    type: {
      type: String,
      enum: [
        "eco",
        "cultural",
        "wildlife",
        "heritage",
        "festival_spot",
        "waterfall",
        "temple",
        "museum",
        "adventure",
        "trekking"
      ],
      required: true
    },

    district: String,
    shortDescription: String,
    description: String,

    images: [String],

    rating: { type: Number, default: 4.5 },

    coordinates: {
      lat: Number,
      lng: Number
    },

    tags: [String],

    bestTimeToVisit: String,
    howToReach: String,
    averageBudget: Number,

    contactPhone: String,
    contactEmail: String,
    officialSite: String,
    bookNowUrl: String,

    accessibility: {
      wheelchairFriendly: { type: Boolean, default: false },
      familyFriendly: { type: Boolean, default: true },
    },

    nearbyPlaces: [
      {
        name: String,
        distanceKm: Number,
        locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }
      }
    ],

    isActive: { type: Boolean, default: true },

    // Approval System
    isApproved: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Reviews & Stats (Unified from ExploreItem)
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    numReviews: { type: Number, default: 0 },
    redirectClicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);
