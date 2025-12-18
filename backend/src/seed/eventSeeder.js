import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "../models/Event.js";

dotenv.config();

const EVENTS = [
    {
        title: "Sarhul Festival",
        description: "Sarhul is the most popular festival among the tribes of Jharkhand. It is celebrated during the spring season when the Sal trees get new flowers.",
        date: new Date("2024-04-12"),
        location: "Ranchi",
        image: "https://source.unsplash.com/800x600/?festival,tribal",
        price: 0,
        ticketsSold: 0,
        totalTickets: 1000,
        isActive: true
    },
    {
        title: "Shravani Mela",
        description: "A month-long festival held in Deoghar during the month of Shravan. Millions of devotees visit the Baba Baidyanath Temple.",
        date: new Date("2024-07-22"),
        location: "Deoghar",
        image: "https://source.unsplash.com/800x600/?temple,crowd",
        price: 0,
        ticketsSold: 0,
        totalTickets: 50000,
        isActive: true
    },
    {
        title: "Karma Festival",
        description: "A harvest festival celebrated by the tribes of Jharkhand. It is dedicated to the Karma tree, which is worshipped for good fortune.",
        date: new Date("2024-09-14"),
        location: "Hazaribagh",
        image: "https://source.unsplash.com/800x600/?dance,culture",
        price: 500,
        ticketsSold: 120,
        totalTickets: 500,
        isActive: true
    },
    {
        title: "Basant Panchami",
        description: "Celebrated to mark the arrival of spring. It is also known as Saraswati Puja.",
        date: new Date("2024-02-14"),
        location: "Jamshedpur",
        image: "https://source.unsplash.com/800x600/?spring,flowers",
        price: 0,
        ticketsSold: 0,
        totalTickets: 2000,
        isActive: true
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ✔");

        await Event.deleteMany();
        console.log("Old events deleted ✔");

        const inserted = await Event.insertMany(EVENTS);
        console.log(`Seeded ${inserted.length} events ✔`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
