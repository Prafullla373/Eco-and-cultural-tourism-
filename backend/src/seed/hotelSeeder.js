import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "../models/Hotel.js";

dotenv.config();

/* -------------------- UNSPLASH IMAGE HELPER -------------------- */
const IMG = (query) =>
  `https://source.unsplash.com/800x600/?${encodeURIComponent(
    query
  )},hotel,resort,room`;

/* -------------------- REAL BOOKING URL HELPER -------------------- */
function bookingURL(name, district) {
  const q = encodeURIComponent(`${name} ${district} hotel`);
  return `https://www.booking.com/searchresults.html?ss=${q}`;
}

/* -------------------- HOTEL LIST -------------------- */

const HOTELS = [
  /* -------------------- RANCHI -------------------- */
  {
    name: "Radisson Blu Hotel Ranchi",
    district: "Ranchi",
    location: "Main Road",
    rating: 4.6,
    priceRange: "₹5000 – ₹9500",
    website: "https://www.radissonhotels.com",
    bookingUrl: bookingURL("Radisson Blu", "Ranchi"),
    images: [{ url: IMG("luxury ranchi hotel") }],
  },
  {
    name: "Le Lac Sarovar Portico",
    district: "Ranchi",
    location: "Line Tank Road",
    rating: 4.3,
    priceRange: "₹3000 – ₹6000",
    website: "https://www.sarovarhotels.com",
    bookingUrl: bookingURL("Sarovar Portico", "Ranchi"),
    images: [{ url: IMG("sarovar ranchi") }],
  },
  {
    name: "Capitol Hill",
    district: "Ranchi",
    location: "Mahatma Gandhi Marg",
    rating: 4.4,
    priceRange: "₹3200 – ₹7000",
    website: "https://www.capitolhillranchi.com",
    bookingUrl: bookingURL("Capitol Hill", "Ranchi"),
    images: [{ url: IMG("capitol hill ranchi") }],
  },

  /* -------------------- DEOGHAR -------------------- */
  {
    name: "Yashoda International",
    district: "Deoghar",
    location: "Tower Chowk",
    rating: 4.2,
    priceRange: "₹2000 – ₹3800",
    website: "https://www.yashodainternational.com",
    bookingUrl: bookingURL("Yashoda International", "Deoghar"),
    images: [{ url: IMG("deoghar hotel") }],
  },
  {
    name: "Imperial Heights",
    district: "Deoghar",
    location: "Castairs Town",
    rating: 4.3,
    priceRange: "₹2200 – ₹4000",
    bookingUrl: bookingURL("Imperial Heights", "Deoghar"),
    website: "https://www.booking.com",
    images: [{ url: IMG("imperial deoghar") }],
  },

  /* -------------------- NETARHAT -------------------- */
  {
    name: "Netarhat Prabhat Vihar Resort",
    district: "Netarhat",
    location: "Sunrise Point",
    rating: 4.7,
    priceRange: "₹2500 – ₹5000",
    website: "https://jharkhandtourism.gov.in",
    bookingUrl: bookingURL("Prabhat Vihar", "Netarhat"),
    images: [{ url: IMG("netarhat resort") }],
  },
  {
    name: "Van Vihar Eco Resort",
    district: "Netarhat",
    location: "Upper Ghaghri",
    rating: 4.4,
    priceRange: "₹1800 – ₹3500",
    website: "https://www.booking.com",
    bookingUrl: bookingURL("Van Vihar", "Netarhat"),
    images: [{ url: IMG("eco resort netarhat") }],
  },

  /* -------------------- JAMSHEDPUR -------------------- */
  {
    name: "The Alcor Hotel",
    district: "Jamshedpur",
    location: "South Park, Bistupur",
    rating: 4.5,
    priceRange: "₹4500 – ₹9000",
    website: "https://www.alcorhotel.com",
    bookingUrl: bookingURL("Alcor Hotel", "Jamshedpur"),
    images: [{ url: IMG("luxury hotel jamshedpur") }],
  },
  {
    name: "Ramada Jamshedpur",
    district: "Jamshedpur",
    location: "Bistupur",
    rating: 4.4,
    priceRange: "₹3500 – ₹7000",
    website: "https://www.wyndhamhotels.com",
    bookingUrl: bookingURL("Ramada", "Jamshedpur"),
    images: [{ url: IMG("ramada jamshedpur") }],
  },
];

/* -------------------- AUTO-SET bookNowUrl -------------------- */
HOTELS.forEach((h) => {
  h.bookNowUrl = h.bookingUrl || h.website;
});

/* -------------------- SEED FUNCTION -------------------- */

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✔");

    await Hotel.deleteMany();
    console.log("Old hotels deleted ✔");

    const inserted = await Hotel.insertMany(HOTELS);
    console.log(`Seeded ${inserted.length} hotels ✔`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
