import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

if (!UNSPLASH_KEY) {
  console.log("❌ ERROR: UNSPLASH_KEY missing in .env");
  process.exit(1);
}

// CONNECT MONGO
await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB");

const exploreSchema = new mongoose.Schema({}, { strict: false });
const Explore = mongoose.model("exploreitems", exploreSchema);

// FUNCTION: Fetch real images from Unsplash
async function fetchImages(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=6&client_id=${UNSPLASH_KEY}`;

    const res = await axios.get(url);
    return res.data.results.map((img) => ({
      url: img.urls.regular,
      photographer: img.user.name,
      link: img.links.html,
    }));
  } catch (err) {
    console.error("Unsplash Error:", err.message);
    return [];
  }
}

// FUNCTION: Get bookNowUrl (official first, TripAdvisor fallback)
function generateURL(item) {
  const title = item.title.toLowerCase().trim();

  const official = {
    "dassam falls": "https://jharkhandtourism.gov.in/dassam-falls",
    "hundru falls": "https://jharkhandtourism.gov.in/hundru-falls",
    "jonha falls": "https://jharkhandtourism.gov.in/jonha-falls",
    "lodh falls": "https://jharkhandtourism.gov.in/lodh-falls",
    "panchghagh falls": "https://jharkhandtourism.gov.in/panchghagh-falls",
    "betla national park": "https://jharkhandtourism.gov.in/betla-national-park",
    "dalma wildlife sanctuary":
      "https://jharkhandtourism.gov.in/dalma-wildlife-sanctuary",
    "palamau tiger reserve":
      "https://jharkhandtourism.gov.in/palamau-tiger-reserve",
  };

  if (official[title]) return official[title];

  return `https://www.tripadvisor.in/Search?q=${encodeURIComponent(item.title)}`;
}

// FIX image structure
function normalizeImages(images) {
  if (!images || images.length === 0) return [];
  if (typeof images[0] === "object") return images;

  return images.map((url) => ({ url }));
}

async function processAll() {
  const items = await Explore.find();
  console.log(`🔍 Found ${items.length} explore items\n`);

  for (const item of items) {
    console.log(`🔄 Updating: ${item.title}`);

    // Fix images
    let newImages = normalizeImages(item.images);

    // Add Unsplash images if needed
    if (!newImages || newImages.length < 3) {
      const fetched = await fetchImages(item.title);
      newImages = [...newImages, ...fetched].slice(0, 6);
      console.log(`   ➕ Added ${fetched.length} Unsplash images`);
    }

    // Official or TripAdvisor URL
    const bookNowUrl = generateURL(item);

    // Set fallback map location (random inside Jharkhand region)
    const mapLocation =
      item.mapLocation ||
      {
        lat: 23.3 + Math.random() * 0.5,
        lng: 85.2 + Math.random() * 0.5,
      };

    // Update explore item
    await Explore.updateOne(
      { _id: item._id },
      {
        $set: {
          images: newImages,
          bookNowUrl,
          officialSite: bookNowUrl.includes("jharkhandtourism")
            ? bookNowUrl
            : undefined,
          mapLocation,
          rating: item.rating || (3 + Math.random() * 2),
          numReviews: item.numReviews || Math.floor(Math.random() * 40),
        },
      }
    );

    console.log(`   ✅ Updated`);
  }

  console.log("\n🎉 ALL EXPLORE ITEMS UPDATED SUCCESSFULLY!");
  process.exit(0);
}

processAll();
