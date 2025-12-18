import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}
if (!UNSPLASH_KEY) {
  console.error("❌ UNSPLASH_KEY not defined in .env");
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB");

// Hotel model (should match your existing model)
import Hotel from "../src/models/Hotel.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cities + sample stays
const cityList = [
  { city: "Ranchi", district: "Ranchi" },
  { city: "Deoghar", district: "Deoghar" },
  { city: "Netarhat", district: "Latehar" },
  { city: "Jamshedpur", district: "Purbi Singhbhum" },
];

const stayTypes = ["Hotel", "Resort", "Eco-stay", "Homestay", "Guest House"];

const amenityPool = [
  "Free WiFi",
  "Parking",
  "Restaurant",
  "AC",
  "24/7 Reception",
  "Room Service",
  "Breakfast included",
  "Hill View",
  "Garden",
  "Nature Walk",
];

// Helper: fetch images from Unsplash
async function fetchImages(query, count = 4) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=${count}&client_id=${UNSPLASH_KEY}`;
  try {
    const res = await axios.get(url);
    return res.data.results.map((img) => ({
      url: img.urls.regular,
      caption: img.alt_description || query,
    }));
  } catch (err) {
    console.warn("Unsplash fetch failed for", query, err.message);
    return [];
  }
}

async function seedHotels() {
  const hotelsToInsert = [];

  for (const loc of cityList) {
    for (let i = 1; i <= 10; i++) {
      const type = stayTypes[randomInt(0, stayTypes.length - 1)];
      const priceLow = randomInt(1500, 3000);
      const priceHigh = priceLow + randomInt(500, 2000);
      const rating = (randomInt(35, 50) / 10).toFixed(1); // e.g. 4.1–5.0
      const numReviews = randomInt(5, 120);

      const hotelName = `${type} ${loc.city} #${i}`;

      const images = await fetchImages(
        `${loc.city} hotel ${type}`,
        4
      );

      const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
        loc.city + " " + type
      )}`;

      hotelsToInsert.push({
        name: hotelName,
        district: loc.district,
        location: loc.city,
        rating: parseFloat(rating),
        numReviews,
        priceRange: `₹${priceLow} – ₹${priceHigh} / night`,
        amenities: amenityPool.sort(() => 0.5 - Math.random()).slice(0, 4),
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        images,
        mapLocation: {
          lat: loc.city === "Netarhat"
            ? 23.5 + Math.random() * 0.1
            : 23.3 + Math.random() * 0.3,
          lng: loc.city === "Netarhat"
            ? 84.27 + Math.random() * 0.1
            : 85.2 + Math.random() * 0.3,
        },
        contactPhone: `+91-${randomInt(6000000000, 9999999999)}`,
        website: bookingUrl,
        bookingUrl,
        shortDescription: `Comfortable ${type.toLowerCase()} stay at ${loc.city}`,
        description: `Enjoy a comfortable stay at ${hotelName}, located in ${loc.city}, ${loc.district}. Perfect for travelers seeking convenience, comfort and local experience.`,
      });
    }
  }

  try {
    const inserted = await Hotel.insertMany(hotelsToInsert);
    console.log("✅ Inserted hotels:", inserted.length);
  } catch (err) {
    console.error("❌ Error inserting hotels:", err);
  } finally {
    process.exit(0);
  }
}

seedHotels();
