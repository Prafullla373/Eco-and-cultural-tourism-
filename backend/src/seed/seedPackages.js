import mongoose from "mongoose";
import dotenv from "dotenv";
import { Package } from "../models/Package.js";
import { Location } from "../models/Location.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const packages = [
    {
        title: "Betla National Park Wildlife Safari",
        category: "wildlife",
        durationDays: 3,
        pricePerPerson: 4500,
        itinerary: [
            "Day 1: Arrival at Betla, Check-in at Forest Rest House, Evening Nature Walk.",
            "Day 2: Morning Elephant Safari, Visit to Palamau Fort, Evening Jeep Safari.",
            "Day 3: Bird Watching, Visit to Kechki Sangam, Departure."
        ],
        inclusions: [
            "Accommodation in Forest Rest House",
            "All meals (Breakfast, Lunch, Dinner)",
            "Safari charges and Guide fees",
            "Pick up and drop from Daltonganj Station"
        ],
        exclusions: [
            "Personal expenses",
            "Camera fees",
            "Travel insurance"
        ],
        providerName: "Jharkhand Wildlife Tourism",
        providerWebsite: "https://jharkhandwildlife.in",
        providerType: "Government",
        bookNowUrl: "https://www.jharkhandtourism.gov.in/booking/betla",
        rating: 4.5,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],

        // New Fields
        highlights: [
            "Elephant Safari in Palamau Tiger Reserve",
            "Historical Palamau Fort visit",
            "Bird watching at Kechki Sangam",
            "Stay inside the forest area"
        ],
        accommodation: "Stay at the heritage Forest Rest House, offering a blend of colonial charm and modern amenities right in the heart of the jungle.",
        sustainableImpact: "This tour supports the local forest conservation efforts. 10% of the proceeds go directly to the Palamau Tiger Reserve Foundation. We strictly follow 'Leave No Trace' principles.",
        packingList: [
            "Binoculars for bird watching",
            "Earth-toned clothing for safari",
            "Comfortable walking shoes",
            "Insect repellent",
            "Sunscreen and hat"
        ],
        faqs: [
            { question: "Is it safe for children?", answer: "Yes, the safari is safe and family-friendly. However, silence must be maintained during the jungle drive." },
            { question: "What is the best time to visit?", answer: "October to March is the best time for wildlife sightings." }
        ],
        cancellationPolicy: "Full refund if cancelled 7 days prior. 50% refund if cancelled 3 days prior. No refund thereafter.",
        totalReviews: 128
    },
    {
        title: "Deoghar Spiritual Journey",
        category: "cultural",
        durationDays: 2,
        pricePerPerson: 2500,
        itinerary: [
            "Day 1: Arrival in Deoghar, Darshan at Baba Baidyanath Dham, Visit to Naulakha Mandir.",
            "Day 2: Visit to Trikut Pahar, Tapovan, and Basukinath Temple. Departure."
        ],
        inclusions: [
            "Hotel Accommodation (3 Star)",
            "Breakfast and Dinner",
            "Local Transport for Sightseeing",
            "VIP Darshan Pass assistance"
        ],
        exclusions: [
            "Train/Flight tickets",
            "Lunch",
            "Donations at temples"
        ],
        providerName: "Spiritual Yatra Travels",
        providerWebsite: "https://spiritualyatra.com",
        providerType: "Private",
        bookNowUrl: "https://www.yatra.com/holidays/deoghar-tour-packages",
        rating: 4.8,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1623945672803-34e857410026?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],

        // New Fields
        highlights: [
            "VIP Darshan at Baba Baidyanath Dham",
            "Ropeway ride at Trikut Pahar",
            "Ancient architecture of Naulakha Mandir",
            "Serene atmosphere of Tapovan"
        ],
        accommodation: "Comfortable 3-star hotel located near the temple complex with pure vegetarian kitchen.",
        sustainableImpact: "We promote plastic-free temple visits and support local flower vendors by sourcing puja materials locally.",
        packingList: [
            "Traditional attire for temple visits",
            "Comfortable slip-on shoes",
            "Water bottle",
            "Small backpack"
        ],
        faqs: [
            { question: "Is photography allowed inside the temple?", answer: "Photography is restricted in the inner sanctum but allowed in the complex." },
            { question: "Is wheelchair assistance available?", answer: "Yes, wheelchair assistance can be arranged upon request." }
        ],
        cancellationPolicy: "Free cancellation up to 24 hours before the trip.",
        totalReviews: 342
    },
    {
        title: "Netarhat - Queen of Chotanagpur",
        category: "weekend",
        durationDays: 3,
        pricePerPerson: 6000,
        itinerary: [
            "Day 1: Drive to Netarhat, Check-in, Sunset at Magnolia Point.",
            "Day 2: Sunrise View, Visit to Upper Ghaghri Falls, Koel View Point, Pine Forest.",
            "Day 3: Visit to Lodh Falls (highest in Jharkhand), Departure."
        ],
        inclusions: [
            "Stay in Prabhat Vihar (Sunrise Point)",
            "All meals",
            "AC Vehicle for transfer and sightseeing",
            "Guide charges"
        ],
        exclusions: [
            "Entry fees at waterfalls",
            "Personal tips"
        ],
        providerName: "Jharkhand Tourism Development Corp",
        providerWebsite: "https://tourism.jharkhand.gov.in",
        providerType: "Government",
        bookNowUrl: "https://tourism.jharkhand.gov.in/hotels/netarhat",
        rating: 4.7,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],

        // New Fields
        highlights: [
            "Spectacular Sunrise and Sunset views",
            "Visit to Lodh Falls - Highest in Jharkhand",
            "Walk through dense Pine Forests",
            "Cool and pleasant climate year-round"
        ],
        accommodation: "Stay at the government-run Prabhat Vihar, offering the best views of the sunrise directly from the property.",
        sustainableImpact: "We encourage guests to buy local handicrafts and organic produce from the Netarhat market, supporting the local tribal economy.",
        packingList: [
            "Light woolens (even in summer evenings)",
            "Good trekking shoes",
            "Camera with extra batteries",
            "Power bank"
        ],
        faqs: [
            { question: "How is the road condition?", answer: "The road to Netarhat is scenic and well-maintained, suitable for all vehicles." },
            { question: "Is there mobile network?", answer: "Major networks like Jio and Airtel work well, but connectivity might be intermittent in deep forests." }
        ],
        cancellationPolicy: "Standard JTDC cancellation rules apply. 10% deduction if cancelled 15 days prior.",
        totalReviews: 89
    },
    {
        title: "Adventure in Dalma Hills",
        category: "adventure",
        durationDays: 2,
        pricePerPerson: 3500,
        itinerary: [
            "Day 1: Trekking in Dalma Wildlife Sanctuary, Visit to Shiva Temple on top.",
            "Day 2: Jungle Safari, Visit to Dimna Lake, Water sports activities."
        ],
        inclusions: [
            "Camping Tents",
            "Bonfire and BBQ Dinner",
            "Trekking Guide",
            "Forest Entry Permit"
        ],
        exclusions: [
            "Water sports charges",
            "Transport to Jamshedpur"
        ],
        providerName: "Dalma Eco Adventures",
        providerWebsite: "https://dalmaadventures.com",
        providerType: "Private",
        bookNowUrl: "https://www.makemytrip.com/holidays-india/jamshedpur-travel-packages.html",
        rating: 4.3,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],

        // New Fields
        highlights: [
            "Trek to Dalma Top",
            "Camping under the stars",
            "Bonfire and BBQ night",
            "Water sports at Dimna Lake"
        ],
        accommodation: "Adventure camping tents with sleeping bags. Common eco-toilets available at the campsite.",
        sustainableImpact: "Zero-waste camping experience. We ensure all waste is brought back and disposed of responsibly.",
        packingList: [
            "Trekking shoes",
            "Torch/Headlamp",
            "Personal water bottle",
            "Warm jacket for night"
        ],
        faqs: [
            { question: "Is it safe for solo female travelers?", answer: "Yes, we have female guides and secure campsites with 24/7 security." },
            { question: "What is the difficulty level of the trek?", answer: "It is a moderate level trek, suitable for beginners with basic fitness." }
        ],
        cancellationPolicy: "Non-refundable booking due to limited slots.",
        totalReviews: 56
    },
    {
        title: "Hazaribagh Wildlife Sanctuary",
        category: "wildlife",
        durationDays: 2,
        pricePerPerson: 3000,
        itinerary: [
            "Day 1: Arrival at Hazaribagh, Check-in, Evening Safari.",
            "Day 2: Morning Bird Watching, Visit to Canary Hill, Departure."
        ],
        inclusions: [
            "Stay in Forest Guest House",
            "All meals",
            "Safari Jeep",
            "Guide"
        ],
        exclusions: [
            "Personal expenses",
            "Tips"
        ],
        providerName: "Hazaribagh Eco Tours",
        providerWebsite: "https://hazaribaghecotours.com",
        providerType: "Private",
        bookNowUrl: "https://www.jharkhandtourism.gov.in/hazaribagh",
        rating: 4.2,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1575550959106-5a7defe28b56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        highlights: [
            "Sighting of Sambhar and Spotted Deer",
            "Canary Hill View Point",
            "Dense Sal Forest",
            "Peaceful Environment"
        ],
        accommodation: "Basic but clean Forest Guest House with necessary amenities.",
        sustainableImpact: "We support the local forest department in maintaining the sanctuary.",
        packingList: [
            "Binoculars",
            "Camera",
            "Walking shoes",
            "Mosquito repellent"
        ],
        faqs: [
            { question: "Is it safe?", answer: "Yes, it is very safe with forest guards patrolling." }
        ],
        cancellationPolicy: "Full refund 48 hours prior.",
        totalReviews: 45
    },
    {
        title: "Parasnath Hills Spiritual Trek",
        category: "cultural",
        durationDays: 2,
        pricePerPerson: 2000,
        itinerary: [
            "Day 1: Arrival at Madhuban, Begin Trek to Shikharji.",
            "Day 2: Darshan at Top, Return Trek, Departure."
        ],
        inclusions: [
            "Dharamshala Stay",
            "Vegetarian Meals",
            "Guide for Trek"
        ],
        exclusions: [
            "Doli/Palki charges",
            "Personal expenses"
        ],
        providerName: "Jain Yatra Sangh",
        providerWebsite: "https://jainyatra.com",
        providerType: "Private",
        bookNowUrl: "https://www.shikharji.com/booking",
        rating: 4.9,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1519955025118-477184379765?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        highlights: [
            "Highest Peak of Jharkhand",
            "Sacred Jain Pilgrimage",
            "Scenic Trekking Route",
            "Spiritual Atmosphere"
        ],
        accommodation: "Simple and clean Dharamshala accommodation.",
        sustainableImpact: "Strictly plastic-free zone. Pilgrims are requested not to litter.",
        packingList: [
            "Good trekking shoes",
            "Walking stick",
            "Water bottle",
            "Warm clothes (it gets cold at top)"
        ],
        faqs: [
            { question: "How long is the trek?", answer: "It is about 9km one way." }
        ],
        cancellationPolicy: "Non-refundable.",
        totalReviews: 512
    },
    {
        title: "Patratu Valley Weekend Getaway",
        category: "weekend",
        durationDays: 1,
        pricePerPerson: 1500,
        itinerary: [
            "Day 1: Drive through the scenic valley, Boating at Patratu Dam, Lunch at Resort, Return."
        ],
        inclusions: [
            "Private Cab",
            "Lunch at Lake Resort",
            "Boating charges"
        ],
        exclusions: [
            "Personal snacks"
        ],
        providerName: "Ranchi City Tours",
        providerWebsite: "https://ranchicitytours.com",
        providerType: "Private",
        bookNowUrl: "https://www.tripadvisor.in/Attraction_Review-g297661-d4138868-Reviews-Patratu_Valley-Ranchi_Jharkhand.html",
        rating: 4.6,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        highlights: [
            "Breathtaking Zig-Zag Roads",
            "Boating at Patratu Dam",
            "Photography Points",
            "Sunset View"
        ],
        accommodation: "Day trip, no stay included.",
        sustainableImpact: "We ensure our vehicles are emission compliant.",
        packingList: [
            "Camera",
            "Sunglasses",
            "Sunscreen"
        ],
        faqs: [
            { question: "Is it good for bikers?", answer: "Yes, it is a biker's paradise." }
        ],
        cancellationPolicy: "Free cancellation up to 12 hours before.",
        totalReviews: 230
    },
    {
        title: "McCluskieganj Colonial Heritage",
        category: "cultural",
        durationDays: 2,
        pricePerPerson: 3500,
        itinerary: [
            "Day 1: Arrival, Visit to Old Bungalows, Church, Sunset Point.",
            "Day 2: Visit to Duga Duggi River, Interaction with Anglo-Indian community, Departure."
        ],
        inclusions: [
            "Stay in Heritage Bungalow",
            "Home-cooked meals",
            "Local Guide"
        ],
        exclusions: [
            "Transport to location"
        ],
        providerName: "Heritage Homestays",
        providerWebsite: "https://mccluskieganjstays.com",
        providerType: "Private",
        bookNowUrl: "https://www.airbnb.co.in/s/McCluskieganj--Jharkhand--India/homes",
        rating: 4.4,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        highlights: [
            "Experience 'Mini London'",
            "Stay in British-era Bungalows",
            "Peaceful and Quiet",
            "Rich History"
        ],
        accommodation: "Authentic colonial bungalow turned into a homestay.",
        sustainableImpact: "Supports the maintenance of heritage structures.",
        packingList: [
            "Books to read",
            "Comfortable clothes",
            "Camera"
        ],
        faqs: [
            { question: "Is there internet?", answer: "Connectivity is limited, perfect for a digital detox." }
        ],
        cancellationPolicy: "50% refund if cancelled 1 week prior.",
        totalReviews: 78
    },
    {
        title: "Hundru & Jonha Waterfalls Tour",
        category: "weekend",
        durationDays: 1,
        pricePerPerson: 1200,
        itinerary: [
            "Day 1: Visit Hundru Falls, Lunch, Visit Jonha Falls, Return."
        ],
        inclusions: [
            "AC Cab",
            "Guide",
            "Parking fees"
        ],
        exclusions: [
            "Lunch",
            "Entry tickets"
        ],
        providerName: "Jharkhand Tourism",
        providerWebsite: "https://tourism.jharkhand.gov.in",
        providerType: "Government",
        bookNowUrl: "https://tourism.jharkhand.gov.in/tours/waterfalls",
        rating: 4.5,
        isActive: true,
        isApproved: true,
        images: ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        highlights: [
            "Spectacular Waterfalls",
            "Picnic Spots",
            "Nature Photography",
            "Trekking down the stairs"
        ],
        accommodation: "Day trip, no stay.",
        sustainableImpact: "We promote 'Carry Your Trash Back' policy.",
        packingList: [
            "Towel and extra clothes",
            "Water bottle",
            "Flip flops"
        ],
        faqs: [
            { question: "Can we swim?", answer: "Swimming is allowed in designated safe zones only." }
        ],
        cancellationPolicy: "Free cancellation.",
        totalReviews: 410
    }
];

const seedPackages = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Clear existing packages
        await Package.deleteMany({});
        console.log("Cleared existing packages");

        // Find a location to link to (or create a dummy one)
        let location = await Location.findOne();
        if (!location) {
            console.log("No location found, creating a dummy location...");
            location = await Location.create({
                name: "Ranchi",
                description: "Capital city of Jharkhand",
                category: "cultural",
                address: "Ranchi, Jharkhand",
                latitude: 23.3441,
                longitude: 85.3096,
                images: ["https://example.com/ranchi.jpg"],
                isApproved: true
            });
        }
        console.log(`Using location: ${location.name} (${location._id})`);

        // Add location ID to packages
        const packagesWithLocation = packages.map(pkg => ({
            ...pkg,
            location: location._id
        }));

        await Package.insertMany(packagesWithLocation);
        console.log("Packages seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding packages:", error);
        process.exit(1);
    }
};

seedPackages();
