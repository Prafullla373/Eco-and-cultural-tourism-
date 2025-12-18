import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String }
});

const roomSchema = new mongoose.Schema({
  type: String,               // Deluxe Room, Suite, Cottage
  price: Number,              // numeric value
  maxGuests: Number,
  amenities: [String],        // ["AC", "Breakfast"]
  images: [imageSchema]
});

const reviewSchema = new mongoose.Schema({
  userName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },
    location: { type: String, required: true },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    priceRange: { type: String },
    amenities: [{ type: String }],

    rooms: [roomSchema],
    reviews: [reviewSchema],

    checkIn: { type: String },
    checkOut: { type: String },

    images: [imageSchema],

    mapLocation: { lat: Number, lng: Number },

    website: { type: String },
    bookingUrl: { type: String },
    bookNowUrl: { type: String },

    contactPhone: String,
    contactEmail: String,

    shortDescription: String,
    description: String,

    // Approval System
    isApproved: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
