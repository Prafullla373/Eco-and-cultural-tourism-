import mongoose from "mongoose";
import { Location } from "../models/Location.js";
import { MONGO_URI } from "../config/env.js";

const locations = [
    // --- WATERFALLS ---
    {
        name: "Hundru Falls",
        slug: "hundru-falls",
        type: "waterfall",
        district: "Ranchi",
        shortDescription: "One of the highest waterfalls in the state (98m).",
        description: "The Hundru Falls is created on the course of the Subarnarekha River, where it falls from a height of 98 metres (322 ft) creating one of the highest water falls in the state.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Hundru_Falls_Ranchi.jpg/1024px-Hundru_Falls_Ranchi.jpg"],
        rating: 4.6,
        tags: ["waterfall", "picnic", "nature"],
        bestTimeToVisit: "June to February",
        averageBudget: 1000,
        isApproved: true, isActive: true
    },
    {
        name: "Dassam Falls",
        slug: "dassam-falls",
        type: "waterfall",
        district: "Ranchi",
        shortDescription: "A beautiful waterfall across the Kanchi river.",
        description: "Dassam Falls is a waterfall located near Taimara village in Bundu police station of Ranchi district.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dassam_Falls.jpg/1024px-Dassam_Falls.jpg"],
        rating: 4.5,
        tags: ["waterfall", "nature"],
        bestTimeToVisit: "October to March",
        averageBudget: 1500,
        isApproved: true, isActive: true
    },
    {
        name: "Jonha Falls",
        slug: "jonha-falls",
        type: "waterfall",
        district: "Ranchi",
        shortDescription: "Also known as Gautamdhara Falls.",
        description: "Jonha Falls is a waterfall located in Ranchi district. It is situated at an edge of the Ranchi plateau.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Jonha_Falls.jpg/1024px-Jonha_Falls.jpg"],
        rating: 4.3,
        tags: ["waterfall", "picnic"],
        bestTimeToVisit: "Monsoon and Winter",
        averageBudget: 1200,
        isApproved: true, isActive: true
    },
    {
        name: "Hirni Falls",
        slug: "hirni-falls",
        type: "waterfall",
        district: "West Singhbhum",
        shortDescription: "Scenic waterfall amidst dense forests.",
        description: "Hirni Falls is located in West Singhbhum, about 70 km from Ranchi. It is a popular picnic spot.",
        images: ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.4,
        tags: ["waterfall", "forest"],
        bestTimeToVisit: "August to December",
        averageBudget: 1000,
        isApproved: true, isActive: true
    },
    {
        name: "Panchghagh Falls",
        slug: "panchghagh-falls",
        type: "waterfall",
        district: "Khunti",
        shortDescription: "A combination of five streams falling together.",
        description: "Panchghagh Falls is a waterfall located in Khunti district. It is a popular tourist destination.",
        images: ["https://images.unsplash.com/photo-1546261563-7c38575a74c6?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.5,
        tags: ["waterfall", "picnic"],
        bestTimeToVisit: "Winter",
        averageBudget: 800,
        isApproved: true, isActive: true
    },
    {
        name: "Lodh Falls",
        slug: "lodh-falls",
        type: "waterfall",
        district: "Latehar",
        shortDescription: "The highest waterfall in Jharkhand (143m).",
        description: "Lodh Falls (also known as Burha Ghagh) is a waterfall in a mid-plateau of Latehar district.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Lodh_Falls.jpg/1024px-Lodh_Falls.jpg"],
        rating: 4.8,
        tags: ["waterfall", "trekking"],
        bestTimeToVisit: "Monsoon",
        averageBudget: 2000,
        isApproved: true, isActive: true
    },
    {
        name: "Usri Falls",
        slug: "usri-falls",
        type: "waterfall",
        district: "Giridih",
        shortDescription: "A waterfall on the Usri River.",
        description: "Usri Falls is a waterfall located in Giridih district. The river falls in three gorges.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Usri_Falls.jpg/1024px-Usri_Falls.jpg"],
        rating: 4.2,
        tags: ["waterfall", "picnic"],
        bestTimeToVisit: "Winter",
        averageBudget: 1000,
        isApproved: true, isActive: true
    },
    {
        name: "Sita Falls",
        slug: "sita-falls",
        type: "waterfall",
        district: "Ranchi",
        shortDescription: "Located near Jonha Falls, dedicated to Goddess Sita.",
        description: "Sita Falls is slightly more secluded than Jonha, offering peace and tranquility.",
        images: ["https://images.unsplash.com/photo-1516900448138-898720b936c7?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.3,
        tags: ["waterfall", "peace"],
        bestTimeToVisit: "Winter",
        averageBudget: 1000,
        isApproved: true, isActive: true
    },

    // --- DAMS & LAKES ---
    {
        name: "Patratu Valley & Dam",
        slug: "patratu-valley",
        type: "adventure",
        district: "Ramgarh",
        shortDescription: "Scenic valley with serpentine roads and a large dam.",
        description: "Patratu Valley is known for its serpentine roads and the Patratu Dam. Great for driving.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Patratu_Valley.jpg/1024px-Patratu_Valley.jpg"],
        rating: 4.7,
        tags: ["valley", "dam", "drive"],
        bestTimeToVisit: "All year",
        averageBudget: 2000,
        isApproved: true, isActive: true
    },
    {
        name: "Kanke Dam",
        slug: "kanke-dam",
        type: "eco",
        district: "Ranchi",
        shortDescription: "Popular sunset spot with boating facilities.",
        description: "Kanke Dam is located at the base of Gonda Hill in Ranchi.",
        images: ["https://images.unsplash.com/photo-1589820296156-2454bb8a4aa2?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.1,
        tags: ["dam", "boating", "sunset"],
        bestTimeToVisit: "Evening",
        averageBudget: 500,
        isApproved: true, isActive: true
    },
    {
        name: "Dimna Lake",
        slug: "dimna-lake",
        type: "eco",
        district: "East Singhbhum",
        shortDescription: "Artificial reservoir near Jamshedpur.",
        description: "Dimna Lake is an artificial reservoir in Jamshedpur, located at the foot of the Dalma Hills.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dimna_Lake.jpg/1024px-Dimna_Lake.jpg"],
        rating: 4.4,
        tags: ["lake", "picnic", "jamshedpur"],
        bestTimeToVisit: "Winter",
        averageBudget: 800,
        isApproved: true, isActive: true
    },
    {
        name: "Tilaiya Dam",
        slug: "tilaiya-dam",
        type: "eco",
        district: "Koderma",
        shortDescription: "First dam of DVC, scenic and serene.",
        description: "Tilaiya Dam was the first of the four multi-purpose dams included in the first phase of the Damodar Valley Corporation.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tilaiya_Dam.jpg/1024px-Tilaiya_Dam.jpg"],
        rating: 4.3,
        tags: ["dam", "history"],
        bestTimeToVisit: "Winter",
        averageBudget: 1500,
        isApproved: true, isActive: true
    },
    {
        name: "Maithon Dam",
        slug: "maithon-dam",
        type: "eco",
        district: "Dhanbad",
        shortDescription: "Large dam with boating and an island.",
        description: "Maithon Dam is located at Maithon, 48 km from Dhanbad. It is located on the banks of Barakar River.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Maithon_Dam.jpg/1024px-Maithon_Dam.jpg"],
        rating: 4.5,
        tags: ["dam", "boating"],
        bestTimeToVisit: "Winter",
        averageBudget: 2000,
        isApproved: true, isActive: true
    },
    {
        name: "Chandil Dam",
        slug: "chandil-dam",
        type: "eco",
        district: "Seraikela Kharsawan",
        shortDescription: "Located on the Subarnarekha River.",
        description: "Chandil Dam is a popular tourist spot known for its scenic beauty and boating.",
        images: ["https://images.unsplash.com/photo-1580910527376-78f773735163?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.2,
        tags: ["dam", "boating"],
        bestTimeToVisit: "Winter",
        averageBudget: 1000,
        isApproved: true, isActive: true
    },

    // --- RELIGIOUS ---
    {
        name: "Baidyanath Dham",
        slug: "baidyanath-dham",
        type: "temple",
        district: "Deoghar",
        shortDescription: "One of the 12 Jyotirlingas.",
        description: "Baidyanath Jyotirlinga temple is one of the twelve Jyotirlingas, the most sacred abodes of Shiva.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Baidyanath_Temple.jpg/1024px-Baidyanath_Temple.jpg"],
        rating: 4.9,
        tags: ["pilgrimage", "shiva"],
        bestTimeToVisit: "Shravan Month",
        averageBudget: 4000,
        isApproved: true, isActive: true
    },
    {
        name: "Basukinath Temple",
        slug: "basukinath-temple",
        type: "temple",
        district: "Dumka",
        shortDescription: "Pilgrims visit here after Baidyanath Dham.",
        description: "Basukinath is a place of worship for Hindus. It is located in Dumka district.",
        images: ["https://images.unsplash.com/photo-1620311496355-66632661c331?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.6,
        tags: ["pilgrimage", "shiva"],
        bestTimeToVisit: "Shravan Month",
        averageBudget: 3000,
        isApproved: true, isActive: true
    },
    {
        name: "Rajrappa Temple",
        slug: "rajrappa-temple",
        type: "temple",
        district: "Ramgarh",
        shortDescription: "Shakti Peeth located at the confluence of rivers.",
        description: "Rajrappa is a waterfall and a pilgrimage centre in Ramgarh district. The Chinnamasta Temple is very famous here.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Rajrappa_Temple.jpg/1024px-Rajrappa_Temple.jpg"],
        rating: 4.7,
        tags: ["pilgrimage", "shakti peeth"],
        bestTimeToVisit: "All year",
        averageBudget: 2000,
        isApproved: true, isActive: true
    },
    {
        name: "Jagannath Temple",
        slug: "jagannath-temple",
        type: "temple",
        district: "Ranchi",
        shortDescription: "Historic 17th-century temple on a hillock.",
        description: "Jagannath Temple in Ranchi is a 17th-century temple dedicated to Lord Jagannath.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Jagannath_Temple_Ranchi.jpg/1024px-Jagannath_Temple_Ranchi.jpg"],
        rating: 4.6,
        tags: ["temple", "history"],
        bestTimeToVisit: "Rath Yatra",
        averageBudget: 500,
        isApproved: true, isActive: true
    },
    {
        name: "Parasnath Hills",
        slug: "parasnath-hills",
        type: "temple",
        district: "Giridih",
        shortDescription: "Highest peak in Jharkhand, Jain pilgrimage.",
        description: "Parasnath is a mountain peak in the Parasnath Range. It is a holy Jain pilgrimage site.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Parasnath_Hill.jpg/1024px-Parasnath_Hill.jpg"],
        rating: 4.9,
        tags: ["pilgrimage", "trekking", "jain"],
        bestTimeToVisit: "Winter",
        averageBudget: 3000,
        isApproved: true, isActive: true
    },
    {
        name: "Pahari Mandir",
        slug: "pahari-mandir",
        type: "temple",
        district: "Ranchi",
        shortDescription: "Shiva temple on a hill with city views.",
        description: "Pahari Mandir is a temple located on a hill in Ranchi. It offers a panoramic view of the city.",
        images: ["https://images.unsplash.com/photo-1605628628842-887463690558?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.4,
        tags: ["temple", "view"],
        bestTimeToVisit: "Shivaratri",
        averageBudget: 200,
        isApproved: true, isActive: true
    },
    {
        name: "Sun Temple",
        slug: "sun-temple",
        type: "temple",
        district: "Ranchi",
        shortDescription: "Beautiful temple architecture shaped like a chariot.",
        description: "The Sun Temple in Ranchi is known for its architecture and serene environment.",
        images: ["https://images.unsplash.com/photo-1565017406-8c0d2c32607e?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.3,
        tags: ["temple", "architecture"],
        bestTimeToVisit: "Chhath Puja",
        averageBudget: 500,
        isApproved: true, isActive: true
    },
    {
        name: "Maluti Temples",
        slug: "maluti-temples",
        type: "heritage",
        district: "Dumka",
        shortDescription: "Group of 72 extant terracotta temples.",
        description: "Maluti is a small town near Shikaripara in Dumka District. It is known for its 72 old terracotta temples.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Maluti_Temples.jpg/1024px-Maluti_Temples.jpg"],
        rating: 4.7,
        tags: ["heritage", "history", "terracotta"],
        bestTimeToVisit: "Winter",
        averageBudget: 2500,
        isApproved: true, isActive: true
    },

    // --- WILDLIFE ---
    {
        name: "Betla National Park",
        slug: "betla-national-park",
        type: "wildlife",
        district: "Latehar",
        shortDescription: "Famous for elephants and tigers.",
        description: "Betla National Park is located on the Chota Nagpur Plateau. It was one of the first national parks in India to become a tiger reserve.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Betla_National_Park_Entrance.jpg/1024px-Betla_National_Park_Entrance.jpg"],
        rating: 4.4,
        tags: ["wildlife", "safari"],
        bestTimeToVisit: "Winter",
        averageBudget: 6000,
        isApproved: true, isActive: true
    },
    {
        name: "Dalma Wildlife Sanctuary",
        slug: "dalma-wildlife-sanctuary",
        type: "wildlife",
        district: "East Singhbhum",
        shortDescription: "Home to elephants, near Jamshedpur.",
        description: "Dalma Wildlife Sanctuary is located 10 km from the city of Jamshedpur. It is famous for its significant population of Indian Elephants.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Dalma_Hills.jpg/1024px-Dalma_Hills.jpg"],
        rating: 4.3,
        tags: ["wildlife", "trekking"],
        bestTimeToVisit: "Winter",
        averageBudget: 3000,
        isApproved: true, isActive: true
    },
    {
        name: "Hazaribagh Wildlife Sanctuary",
        slug: "hazaribagh-wildlife-sanctuary",
        type: "wildlife",
        district: "Hazaribagh",
        shortDescription: "Scenic sanctuary with diverse flora and fauna.",
        description: "Hazaribagh Wildlife Sanctuary is a wildlife sanctuary in Jharkhand, India, about 55 miles north of Ranchi.",
        images: ["https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.2,
        tags: ["wildlife", "nature"],
        bestTimeToVisit: "Winter",
        averageBudget: 2500,
        isApproved: true, isActive: true
    },

    // --- HILLS & SCENIC ---
    {
        name: "Netarhat",
        slug: "netarhat",
        type: "eco",
        district: "Latehar",
        shortDescription: "Queen of Chotanagpur.",
        description: "Netarhat is a hill station in Latehar district. Famous for sunrise/sunset.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Netarhat_Sunrise.jpg/1024px-Netarhat_Sunrise.jpg"],
        rating: 4.8,
        tags: ["hill station", "sunrise"],
        bestTimeToVisit: "Summer/Winter",
        averageBudget: 5000,
        isApproved: true, isActive: true
    },
    {
        name: "Tagore Hill",
        slug: "tagore-hill",
        type: "heritage",
        district: "Ranchi",
        shortDescription: "Associated with Rabindranath Tagore.",
        description: "Tagore Hill also known as Morabadi Hill is situated in Ranchi. The elder brother of Rabindranath Tagore, Jyotirindranath Tagore settled here.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tagore_Hill.jpg/1024px-Tagore_Hill.jpg"],
        rating: 4.1,
        tags: ["heritage", "view"],
        bestTimeToVisit: "Evening",
        averageBudget: 200,
        isApproved: true, isActive: true
    },
    {
        name: "Canary Hill",
        slug: "canary-hill",
        type: "eco",
        district: "Hazaribagh",
        shortDescription: "Popular picnic spot with a watchtower.",
        description: "Canary Hill is a popular spot in Hazaribagh. It has a watchtower that offers a view of the town.",
        images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.2,
        tags: ["hill", "view"],
        bestTimeToVisit: "Winter",
        averageBudget: 500,
        isApproved: true, isActive: true
    },

    // --- PARKS & MUSEUMS ---
    {
        name: "Rock Garden",
        slug: "rock-garden",
        type: "eco",
        district: "Ranchi",
        shortDescription: "Garden carved out of rocks.",
        description: "The Rock Garden in Ranchi is a popular tourist spot built out of the rocks of Gonda Hill.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rock_Garden_Ranchi.jpg/1024px-Rock_Garden_Ranchi.jpg"],
        rating: 4.2,
        tags: ["garden", "picnic"],
        bestTimeToVisit: "Evening",
        averageBudget: 500,
        isApproved: true, isActive: true
    },
    {
        name: "Jubilee Park",
        slug: "jubilee-park",
        type: "eco",
        district: "East Singhbhum",
        shortDescription: "Mogul Garden of Jamshedpur.",
        description: "Jubilee Park is an urban park located in the city of Jamshedpur. It is modeled after the Brindavan Gardens of Mysore.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Jubilee_Park_Jamshedpur.jpg/1024px-Jubilee_Park_Jamshedpur.jpg"],
        rating: 4.7,
        tags: ["park", "jamshedpur"],
        bestTimeToVisit: "Evening",
        averageBudget: 500,
        isApproved: true, isActive: true
    },
    {
        name: "Tribal Museum",
        slug: "tribal-museum",
        type: "museum",
        district: "Ranchi",
        shortDescription: "Showcasing the rich tribal culture of Jharkhand.",
        description: "Dr. Ram Dayal Munda Tribal Welfare Research Institute museum in Ranchi showcases the life and culture of the tribes of Jharkhand.",
        images: ["https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.5,
        tags: ["museum", "culture", "history"],
        bestTimeToVisit: "Day time",
        averageBudget: 200,
        isApproved: true, isActive: true
    },
    {
        name: "State Museum Hotwar",
        slug: "state-museum-hotwar",
        type: "museum",
        district: "Ranchi",
        shortDescription: "Archaeological and historical artifacts.",
        description: "The State Museum in Hotwar, Ranchi displays the cultural heritage, history, and archaeology of the region.",
        images: ["https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.3,
        tags: ["museum", "history"],
        bestTimeToVisit: "Day time",
        averageBudget: 200,
        isApproved: true, isActive: true
    }
];

const seedDB = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        let count = 0;
        for (const loc of locations) {
            await Location.findOneAndUpdate(
                { slug: loc.slug },
                loc,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            count++;
        }

        console.log(`Seeding complete. Processed ${count} locations.`);
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
