import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const exploreItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Eco Tourism",
        "Cultural Tourism",
        "Wildlife",
        "Heritage",
        "Festivals",
        "Handicrafts",
        "Art & Crafts",
        "Tribal Dance",
        "Famous Foods",
        "Adventures",
        "Trekking Spots",
        "Waterfalls",
        "Temples",
        "Museums",
      ],
    },

    subCategory: { type: String },
    location: { type: String, required: true },
    district: { type: String },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    shortDescription: { type: String },
    description: { type: String },

    images: [imageSchema],

    tags: [{ type: String }],

    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },

    bestSeason: { type: String },
    averageBudget: { type: Number },

    accessibility: {
      wheelchairFriendly: { type: Boolean, default: false },
      familyFriendly: { type: Boolean, default: true },
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    reviews: [reviewSchema],
    redirectClicks: { type: Number, default: 0 },

    contactPhone: { type: String },
    contactEmail: { type: String },
    officialSite: { type: String },
    bookNowUrl: { type: String },
  },
  { timestamps: true }
);

// ⭐⭐⭐ IMPORTANT — FORCE MONGOOSE TO USE YOUR REAL COLLECTION NAME ⭐⭐⭐
const ExploreItem = mongoose.model("ExploreItem", exploreItemSchema, "exploreitems");

export default ExploreItem;
