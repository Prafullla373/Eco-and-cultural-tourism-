import mongoose from "mongoose";
import dotenv from "dotenv";
import { Location } from "../models/Location.js";
import Hotel from "../models/Hotel.js";
import { Package } from "../models/Package.js";
import { User } from "../models/User.js";
import Culture from "../models/Culture.js";
import { Handicraft } from "../models/Handicraft.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(`Error connecting: ${error.message}`);
        process.exit(1);
    }
};

const locationsData = [
    { name: "Dassam Falls", district: "Ranchi" },
    { name: "Netarhat", district: "Latehar" },
    { name: "Hundru Falls", district: "Ranchi" },
    { name: "Patratu Valley & Dam", district: "Ramgarh" },
    { name: "Parasnath Hills", district: "Giridih" },
    { name: "Betla National Park", district: "Latehar" },
    { name: "Jonha Falls", district: "Ranchi" },
    { name: "Jagannath Temple", district: "Ranchi" },
    { name: "Rock Garden", district: "Ranchi" },
    { name: "Deoghar (Baidyanath Dham)", district: "Deoghar" },
    { name: "Hirni Falls", district: "West Singhbhum" },
    { name: "Panchghagh Falls", district: "Khunti" },
    { name: "Lodh Falls", district: "Latehar" },
    { name: "Usri Falls", district: "Giridih" },
    { name: "Sita Falls", district: "Ranchi" },
    { name: "Kanke Dam", district: "Ranchi" },
    { name: "Dimna Lake", district: "East Singhbhum" },
    { name: "Tilaiya Dam", district: "Koderma" },
    { name: "Maithon Dam", district: "Dhanbad" },
    { name: "Chandil Dam", district: "Seraikela Kharsawan" },
    { name: "Baidyanath Dham", district: "Deoghar" },
    { name: "Basukinath Temple", district: "Dumka" },
    { name: "Rajrappa Temple", district: "Ramgarh" },
    { name: "Pahari Mandir", district: "Ranchi" },
    { name: "Sun Temple", district: "Ranchi" },
    { name: "Maluti Temples", district: "Dumka" },
    { name: "Dalma Wildlife Sanctuary", district: "East Singhbhum" },
    { name: "Hazaribagh Wildlife Sanctuary", district: "Hazaribagh" },
    { name: "Tagore Hill", district: "Ranchi" },
    { name: "Canary Hill", district: "Hazaribagh" },
    { name: "Jubilee Park", district: "East Singhbhum" },
    { name: "Tribal Museum", district: "Ranchi" },
    { name: "State Museum Hotwar", district: "Ranchi" }
];

const seedData = async () => {
    await connectDB();

    try {
        console.log("Seeding real data...");

        // 1. Fetch all locations to get IDs
        const dbLocations = await Location.find({});
        const locationMap = {};
        dbLocations.forEach(loc => {
            locationMap[loc.name] = loc;
        });

        // 2. Seed Hotels
        const hotels = [];
        for (const loc of locationsData) {
            const numHotels = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < numHotels; i++) {
                hotels.push({
                    name: `${loc.name} Resort & Spa ${i + 1}`,
                    district: loc.district,
                    location: loc.name,
                    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                    numReviews: Math.floor(Math.random() * 100),
                    priceRange: `₹${Math.floor(Math.random() * 3000 + 1500)} - ₹${Math.floor(Math.random() * 5000 + 5000)}`,
                    amenities: ["Free WiFi", "Breakfast", "Parking", "AC", "Restaurant"],
                    images: [{ url: "https://placehold.co/600x400?text=Hotel+Image", caption: "Exterior View" }],
                    shortDescription: `Experience luxury and comfort at ${loc.name} Resort.`,
                    description: `Located near ${loc.name}, this hotel offers the best amenities and a comfortable stay for tourists.`,
                    isApproved: true,
                    mapLocation: locationMap[loc.name]?.coordinates || { lat: 23.3441, lng: 85.3096 }
                });
            }
        }
        await Hotel.insertMany(hotels);
        console.log(`Seeded ${hotels.length} hotels.`);

        // 3. Seed Packages
        const packages = [];
        for (const loc of locationsData) {
            if (locationMap[loc.name]) {
                packages.push({
                    title: `${loc.name} Adventure Package`,
                    location: locationMap[loc.name]._id,
                    images: ["https://placehold.co/600x400?text=Package+Image"],
                    category: "adventure",
                    durationDays: Math.floor(Math.random() * 3) + 2,
                    pricePerPerson: Math.floor(Math.random() * 5000 + 3000),
                    itinerary: ["Day 1: Arrival and Sightseeing", "Day 2: Adventure Activities", "Day 3: Departure"],
                    inclusions: ["Accommodation", "Meals", "Guide", "Transport"],
                    exclusions: ["Personal Expenses"],
                    bookNowUrl: "#",
                    rating: 4.5,
                    isActive: true,
                    isApproved: true,
                    highlights: ["Scenic Views", "Local Culture", "Trekking"],
                    accommodation: "3 Star Hotel",
                    sustainableImpact: "Eco-friendly practices followed."
                });
            }
        }
        await Package.insertMany(packages);
        console.log(`Seeded ${packages.length} packages.`);

        // 4. Seed Guides
        const guides = [];
        const uniqueDistricts = [...new Set(locationsData.map(l => l.district))];
        for (const district of uniqueDistricts) {
            const numGuides = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < numGuides; i++) {
                guides.push({
                    name: `Guide ${district} ${i + 1}`,
                    email: `guide${district.toLowerCase().replace(/\s/g, '')}${i + 1}@example.com`,
                    mobile: "9876543210",
                    password: "password123",
                    role: "local_guide",
                    district: district,
                    experienceYears: Math.floor(Math.random() * 10) + 2,
                    languages: ["Hindi", "English", "Nagpuri"],
                    expertise: ["Cultural", "Nature"],
                    bio: `Expert guide in ${district} with years of experience.`,
                    availability: "Full-time",
                    isActive: true
                });
            }
        }
        await User.insertMany(guides);
        console.log(`Seeded ${guides.length} guides.`);

        // 5. Seed Culture (Food, Art, Dance)
        const cultureItems = [];
        for (const district of uniqueDistricts) {
            // Food
            cultureItems.push({
                title: `${district} Special Thali`,
                category: "Cuisine",
                description: `A traditional platter from ${district} featuring local delicacies like Dhuska, Chilka Roti, and Rugra.`,
                images: ["https://placehold.co/600x400?text=Food+Image"],
                location: district,
                tags: ["Food", "Traditional", "Spicy"]
            });
            // Art
            cultureItems.push({
                title: `${district} Tribal Art`,
                category: "Art",
                description: `Exquisite tribal art forms native to ${district}, depicting nature and daily life.`,
                images: ["https://placehold.co/600x400?text=Art+Image"],
                location: district,
                tags: ["Art", "Tribal", "Painting"]
            });
        }
        await Culture.insertMany(cultureItems);
        console.log(`Seeded ${cultureItems.length} culture items.`);

        // 6. Seed Handicrafts
        const handicrafts = [];
        for (const district of uniqueDistricts) {
            handicrafts.push({
                name: `${district} Bamboo Craft`,
                district: district,
                description: `Handcrafted bamboo products made by skilled artisans of ${district}.`,
                category: "Bamboo",
                images: ["https://placehold.co/600x400?text=Handicraft+Image"],
                material: "Bamboo",
                priceRange: "₹200 - ₹2000",
                contact: "9876543210",
                isActive: true
            });
        }
        await Handicraft.insertMany(handicrafts);
        console.log(`Seeded ${handicrafts.length} handicrafts.`);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        mongoose.disconnect();
        console.log("Done.");
    }
};

seedData();
