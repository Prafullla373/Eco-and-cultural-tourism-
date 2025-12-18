import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "../models/Hotel.js";

dotenv.config();

// Default realistic amenities
const DEFAULT_AMENITIES = [
  "WiFi",
  "Restaurant",
  "Parking",
  "AC",
  "Breakfast",
  "Room Service",
  "TV",
  "Hot Water"
];

// Default room sets
const DEFAULT_ROOMS = [
  {
    type: "Deluxe Room",
    price: 3200,
    maxGuests: 2,
    amenities: ["AC", "WiFi", "Breakfast"],
    images: [{ url: "https://source.unsplash.com/800x600/?deluxe-room" }]
  },
  {
    type: "Executive Suite",
    price: 5200,
    maxGuests: 3,
    amenities: ["AC", "WiFi", "Breakfast", "TV", "Hot Water"],
    images: [{ url: "https://source.unsplash.com/800x600/?suite-hotel" }]
  }
];

const SAMPLE_REVIEWS = [
  {
    userName: "Rohit Sharma",
    rating: 4.5,
    comment: "Excellent stay, rooms very clean and staff was friendly."
  },
  {
    userName: "Anita Verma",
    rating: 4.2,
    comment: "Good location, food quality was amazing!"
  },
  {
    userName: "Sandeep Kumar",
    rating: 4.7,
    comment: "Highly recommended—great hospitality and ambience."
  }
];

async function fillRealDetailData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected ✔");

    const hotels = await Hotel.find();
    console.log(`Updating ${hotels.length} hotels…`);

    for (let h of hotels) {
      let updated = false;

      // Description update
      if (!h.shortDescription) {
        h.shortDescription = `${h.name} offers comfortable rooms and great service in ${h.district}. Ideal for families, business travellers and tourists.`;
        updated = true;
      }

      if (!h.description) {
        h.description = `${h.name} is a well-known property located in ${h.location}, ${h.district}. 
It offers spacious rooms, premium amenities, on-site dining and easy connectivity to major tourist attractions. 
Perfect for weekend getaways, business trips and family vacations.`;
        updated = true;
      }

      // Amenities update
      if (!h.amenities || h.amenities.length === 0) {
        h.amenities = DEFAULT_AMENITIES;
        updated = true;
      }

      // Rooms update
      if (!h.rooms || h.rooms.length === 0) {
        h.rooms = DEFAULT_ROOMS;
        updated = true;
      }

      // Reviews update
      if (!h.reviews || h.reviews.length === 0) {
        h.reviews = SAMPLE_REVIEWS;
        h.numReviews = SAMPLE_REVIEWS.length;

        // Rating avg
        h.rating =
          SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) /
          SAMPLE_REVIEWS.length;

        updated = true;
      }

      // Map coordinates update
      if (!h.mapLocation || !h.mapLocation.lat) {
        h.mapLocation = {
          lat: 23.36 + Math.random() * 0.2,
          lng: 85.33 + Math.random() * 0.2
        };
        updated = true;
      }

      if (updated) await h.save();
    }

    console.log("Hotel Level-2 details updated successfully ✔");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fillRealDetailData();
