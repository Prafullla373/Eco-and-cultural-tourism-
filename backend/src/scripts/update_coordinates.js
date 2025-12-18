import mongoose from "mongoose";
import dotenv from "dotenv";
import { Location } from "../models/Location.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });
import fs from 'fs';
const logStream = fs.createWriteStream("debug_update.txt", { flags: 'a' });
function log(msg) {
    console.log(msg);
    logStream.write(msg + "\n");
}


const coordinatesMap = {
    "Dassam Falls": { lat: 23.1467, lng: 85.4744 },
    "Netarhat": { lat: 23.4796, lng: 84.2663 },
    "Hundru Falls": { lat: 23.4446, lng: 85.6558 },
    "Patratu Valley & Dam": { lat: 23.6333, lng: 85.2833 },
    "Parasnath Hills": { lat: 23.9611, lng: 86.1264 },
    "Betla National Park": { lat: 23.8833, lng: 84.1833 },
    "Jonha Falls": { lat: 23.4167, lng: 85.6167 },
    "Jagannath Temple": { lat: 23.3333, lng: 85.3000 },
    "Rock Garden": { lat: 23.3833, lng: 85.3167 },
    "Deoghar (Baidyanath Dham)": { lat: 24.4833, lng: 86.7000 },
    "Hirni Falls": { lat: 22.9833, lng: 85.2333 },
    "Panchghagh Falls": { lat: 23.0000, lng: 85.0000 },
    "Lodh Falls": { lat: 23.5333, lng: 84.1667 },
    "Usri Falls": { lat: 24.1833, lng: 86.3000 },
    "Sita Falls": { lat: 23.4500, lng: 85.6000 },
    "Kanke Dam": { lat: 23.4000, lng: 85.3167 },
    "Dimna Lake": { lat: 22.8500, lng: 86.2500 },
    "Tilaiya Dam": { lat: 24.3167, lng: 85.5167 },
    "Maithon Dam": { lat: 23.7833, lng: 86.8167 },
    "Chandil Dam": { lat: 22.9667, lng: 86.0500 },
    "Baidyanath Dham": { lat: 24.4922, lng: 86.7003 },
    "Basukinath Temple": { lat: 24.3833, lng: 87.0833 },
    "Rajrappa Temple": { lat: 23.6333, lng: 85.7167 },
    "Pahari Mandir": { lat: 23.3667, lng: 85.3000 },
    "Sun Temple": { lat: 23.1833, lng: 85.5500 },
    "Maluti Temples": { lat: 24.1667, lng: 87.6833 },
    "Dalma Wildlife Sanctuary": { lat: 22.9000, lng: 86.2000 },
    "Hazaribagh Wildlife Sanctuary": { lat: 24.0000, lng: 85.3667 },
    "Tagore Hill": { lat: 23.3833, lng: 85.3333 },
    "Canary Hill": { lat: 24.0000, lng: 85.3500 },
    "Jubilee Park": { lat: 22.8000, lng: 86.1833 },
    "Tribal Museum": { lat: 23.3667, lng: 85.3333 },
    "State Museum Hotwar": { lat: 23.3833, lng: 85.3667 }
};

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }
        await mongoose.connect(process.env.MONGO_URI);
        log("MongoDB Connected");
    } catch (error) {
        log(`Error connecting: ${error.message}`);
        process.exit(1);
    }
};

const updateCoordinates = async () => {
    await connectDB();

    try {
        const locations = await Location.find({});
        log(`Found ${locations.length} locations.`);

        for (const loc of locations) {
            if (coordinatesMap[loc.name]) {
                loc.coordinates = coordinatesMap[loc.name];
                loc.mapLocation = coordinatesMap[loc.name]; // Update both just in case
                await loc.save();
                log(`Updated ${loc.name}`);
            } else {
                log(`No coordinates found for ${loc.name}`);
            }
        }

    } catch (error) {
        log(`Error updating locations: ${error}`);
    } finally {
        mongoose.disconnect();
        log("Done.");
    }
};

updateCoordinates();
