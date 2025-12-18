import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import ExploreItem from "./src/models/ExploreItem.js";
import { exploreRealData } from "./src/data/exploreRealData.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

async function getImages(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=5&client_id=${UNSPLASH_KEY}`;
    const { data } = await axios.get(url);

    return data.results.map((img) => ({
      url: img.urls.regular,
      caption: img.alt_description || query
    }));
  } catch (err) {
    console.error("Image fetch error for:", query);
    return [];
  }
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to Database");

  await ExploreItem.deleteMany({});
  console.log("Old data removed.");

  const itemsToInsert = [];

  for (const item of exploreRealData) {
    console.log("Fetching:", item.title);

    const imgs = await getImages(item.title + " Jharkhand");

    itemsToInsert.push({
      title: item.title,
      category: item.category,
      location: item.location,
      district: item.district,
      shortDescription: item.short,
      description: item.long,
      rating: 4 + Math.random(),
      images: imgs,
      tags: [item.category, item.title, item.district],
      mapLocation: { lat: item.lat, lng: item.lng },
    });
  }

  await ExploreItem.insertMany(itemsToInsert);

  console.log("✨ DONE — Real Explore Data Inserted Successfully!");
  process.exit();
}

seed();
