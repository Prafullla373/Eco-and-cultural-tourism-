import mongoose from "mongoose";
import dotenv from "dotenv";
import Culture from "../models/Culture.js";

dotenv.config();

const cultureData = [
    // --- DANCE ---
    {
        title: "Chhau Dance",
        category: "Dance",
        description: "Chhau is a semi-classical Indian dance with martial and folk origins. The Seraikella Chhau of Jharkhand is known for its use of masks and stylized movements.",
        history: "Originating in the mock fights of the Odia paikas (warriors), Chhau has evolved into a sophisticated dance form depicting stories from the Ramayana and Mahabharata.",
        significance: "It is a UNESCO Intangible Cultural Heritage. It represents the martial spirit and artistic finesse of the region.",
        images: [
            "https://images.unsplash.com/photo-1603786566280-5a3f9f9e5c9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Chhau_Dance.jpg/1200px-Chhau_Dance.jpg"
        ],
        location: "Seraikella",
        tags: ["dance", "mask", "martial arts", "unesco"],
    },
    {
        title: "Jhumair Dance",
        category: "Dance",
        description: "Jhumair is a popular folk dance performed during harvest season and festivals. It involves synchronized movements and rhythmic footwork.",
        history: "Traditionally performed by the tea tribes and local communities, it celebrates the joy of harvest and community bonding.",
        significance: "It fosters social unity and is a key part of the Karma festival celebrations.",
        images: [
            "https://images.unsplash.com/photo-1543506346-646743b67942?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Tea Gardens, Ranchi",
        tags: ["dance", "folk", "harvest", "community"],
    },
    {
        title: "Domkach",
        category: "Dance",
        description: "Domkach is a folk dance performed by the women of the bridegroom's family when the men have gone to the bride's house for the wedding.",
        history: "It is a playful and humorous dance that keeps the women awake and entertained during the wedding night.",
        significance: "It is a unique wedding tradition that highlights the role of women in social ceremonies.",
        images: [
            "https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Chota Nagpur Plateau",
        tags: ["dance", "wedding", "women", "folk"],
    },
    {
        title: "Paika Dance",
        category: "Dance",
        description: "Paika is a martial dance performed by men holding swords and shields. It showcases physical strength and agility.",
        history: "Derived from the 'Paikas' or foot soldiers of ancient times, it was used to train warriors.",
        significance: "It preserves the martial traditions of the region and is performed to welcome guests.",
        images: [
            "https://images.unsplash.com/photo-1590050752117-238cb0fb9d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Munda Region",
        tags: ["dance", "martial", "sword", "men"],
    },

    // --- FESTIVAL ---
    {
        title: "Sarhul Festival",
        category: "Festival",
        description: "Sarhul is the most popular tribal festival of Jharkhand, celebrating the worship of Sal trees and nature.",
        history: "Celebrated during the spring season, it marks the beginning of the New Year for the tribal communities like Oraon, Munda, and Ho.",
        significance: "It symbolizes the symbiotic relationship between humans and nature. People worship the Sal tree, which provides timber, leaves, and flowers.",
        images: [
            "https://images.unsplash.com/photo-1583088580000-000000000000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://static.toiimg.com/photo/msid-90647898/90647898.jpg"
        ],
        location: "All over Jharkhand",
        tags: ["festival", "nature", "tribal", "spring"],
    },
    {
        title: "Karma Festival",
        category: "Festival",
        description: "Karma is a harvest festival celebrated by the siblings for the well-being of their brothers. The Karma tree is worshipped.",
        history: "Legend has it that seven brothers were saved by the Karma tree. It is celebrated on the 11th moon of the Bhadrapada month.",
        significance: "It emphasizes the bond between brothers and sisters and the importance of trees in tribal life.",
        images: [
            "https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Chota Nagpur Plateau",
        tags: ["festival", "harvest", "siblings", "nature"],
    },
    {
        title: "Tusu Parab",
        category: "Festival",
        description: "Tusu Parab is a harvest festival celebrated during Makar Sankranti. It involves the immersion of Tusu idols.",
        history: "It is a festival of the Kurmi and tribal communities, celebrating the end of the harvest season.",
        significance: "It is known for its colorful processions and folk songs.",
        images: [
            "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Panch Pargana",
        tags: ["festival", "harvest", "winter", "folk"],
    },
    {
        title: "Hal Punhya",
        category: "Festival",
        description: "Hal Punhya marks the beginning of the ploughing season. It signifies the start of agricultural activities.",
        history: "Celebrated on the first day of the month of Magh, it is considered auspicious for farming.",
        significance: "It represents the hope for a good harvest and the importance of agriculture.",
        images: [
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Rural Jharkhand",
        tags: ["festival", "agriculture", "farming", "spring"],
    },

    // --- ART ---
    {
        title: "Sohrai Painting",
        category: "Art",
        description: "Sohrai is a traditional mural art form practiced by women during the harvest festival. It involves painting mud walls with natural colors.",
        history: "Dating back centuries, this art form is passed down from mothers to daughters. It is closely linked to the cattle-worshipping festival of Sohrai.",
        significance: "It is a GI (Geographical Indication) tagged art form. It reflects the agricultural lifestyle and reverence for animals.",
        images: [
            "https://images.unsplash.com/photo-1590050752117-238cb0fb9d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sohrai_Art.jpg/800px-Sohrai_Art.jpg"
        ],
        location: "Hazaribagh",
        tags: ["art", "painting", "harvest", "gi tag"],
    },
    {
        title: "Kohvar Painting",
        category: "Art",
        description: "Kohvar is a mural art form practiced during weddings. 'Koh' means cave and 'Var' means husband.",
        history: "It depicts fertility symbols and is painted in the bridal chamber to bless the couple.",
        significance: "Also a GI tagged art, it represents the continuity of lineage and fertility.",
        images: [
            "https://images.unsplash.com/photo-1582560475093-d09bc3020944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Hazaribagh",
        tags: ["art", "painting", "wedding", "gi tag"],
    },
    {
        title: "Dhokra Art",
        category: "Art",
        description: "Dhokra is an ancient folk art tradition of non-ferrous metal casting using the lost-wax casting technique.",
        history: "This technique has been used in India for over 4,000 years (since the Mohenjo-daro dancing girl).",
        significance: "Jharkhand's Malhor tribes are famous for this craft, creating intricate figurines, jewelry, and home decor.",
        images: [
            "https://images.unsplash.com/photo-1615890656083-1f1d1d1d1d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Dumka, Hazaribagh",
        tags: ["art", "metal", "craft", "ancient"],
    },
    {
        title: "Bamboo Crafts",
        category: "Art",
        description: "Bamboo craft is a major livelihood for many tribes. They create baskets, mats, and household items.",
        history: "With abundant bamboo forests, this craft has developed as a sustainable way of life.",
        significance: "It showcases the sustainable use of natural resources and skilled craftsmanship.",
        images: [
            "https://images.unsplash.com/photo-1596464716127-f9a8759fa413?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Simdega, Gumla",
        tags: ["art", "craft", "bamboo", "sustainable"],
    },

    // --- MUSIC ---
    {
        title: "Mandar",
        category: "Music",
        description: "The Mandar is a traditional drum and the most popular musical instrument in Jharkhand.",
        history: "It is an integral part of tribal culture, used in almost all festivals and dances.",
        significance: "It represents the rhythm of tribal life. No festival is complete without the beats of the Mandar.",
        images: [
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "All over Jharkhand",
        tags: ["music", "instrument", "drum", "folk"],
    },
    {
        title: "Bansuri (Flute)",
        category: "Music",
        description: "The bamboo flute is a melodious instrument widely used in folk music.",
        history: "Associated with Lord Krishna and pastoral life, it is a favorite among the youth.",
        significance: "It adds a soulful melody to the rhythmic beats of the drums.",
        images: [
            "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Rural Jharkhand",
        tags: ["music", "instrument", "flute", "melody"],
    },
    {
        title: "Nagara",
        category: "Music",
        description: "Nagara is a large drum played with sticks, often accompanying the Mandar.",
        history: "Used in public announcements and festivals to gather people.",
        significance: "Its loud and deep sound resonates with the energy of the community.",
        images: [
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Tribal Villages",
        tags: ["music", "instrument", "drum", "loud"],
    },

    // --- CUISINE ---
    {
        title: "Dhuska",
        category: "Cuisine",
        description: "Dhuska is a popular deep-fried snack made from rice and lentil batter.",
        history: "It is a staple breakfast item and street food in Jharkhand.",
        significance: "Often served with Ghugni (chickpea curry), it is a must-try local delicacy.",
        images: [
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Ranchi, Jamshedpur",
        tags: ["cuisine", "food", "snack", "fried"],
    },
    {
        title: "Litti Chokha",
        category: "Cuisine",
        description: "Though originally from Bihar, Litti Chokha is immensely popular in Jharkhand. It consists of wheat balls stuffed with sattu and roasted.",
        history: "A rustic dish that was a staple for farmers and travelers due to its long shelf life.",
        significance: "It represents the simple yet hearty food culture of the region.",
        images: [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "All over Jharkhand",
        tags: ["cuisine", "food", "roasted", "healthy"],
    },
    {
        title: "Handia",
        category: "Cuisine",
        description: "Handia is a traditional rice beer made by fermenting rice with herbal tablets (ranu).",
        history: "It has been a part of tribal culture for centuries, consumed during festivals and social gatherings.",
        significance: "It is considered a sacred drink offered to deities and guests.",
        images: [
            "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        location: "Tribal Belts",
        tags: ["cuisine", "drink", "fermented", "traditional"],
    },
];

// --- LOCAL GUIDES (20 Profiles) ---
const guideImages = [
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man with turban
    "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman in saree
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman traditional
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man portrait
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman portrait
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man portrait
    "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman smiling
    "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man smiling
    "https://images.unsplash.com/photo-1619380061814-58f03700229c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man rural
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman portrait
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man beard
    "https://images.unsplash.com/photo-1554151228-14d9def656ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman close up
    "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man portrait
    "https://images.unsplash.com/photo-1542596594-649edbc13630?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman happy
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman portrait
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man smiling
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman portrait
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Woman portrait
    "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Man portrait
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"  // Woman portrait
];

const guideNames = [
    "Ramesh Munda", "Sita Oraon", "Birsa Hembrom", "Anita Soren", "Rajesh Mahto",
    "Sunita Tudu", "Vikram Singh", "Priya Kerketta", "Amit Beck", "Rina Ekka",
    "Suresh Bediya", "Kavita Kumari", "Manoj Tirkey", "Anjali Lakra", "Deepak Minj",
    "Pooja Toppo", "Rahul Kachhap", "Meena Khalxo", "Sanjay Gope", "Neha Bara"
];

const locations = ["Ranchi", "Hazaribagh", "Deoghar", "Jamshedpur", "Netarhat", "Betla", "Dhanbad", "Dumka"];
const languages = ["Hindi, English, Sadri", "Hindi, Mundari", "Hindi, Santhali", "Hindi, English, Kurukh", "Hindi, Bengali"];

for (let i = 0; i < 20; i++) {
    cultureData.push({
        title: guideNames[i],
        category: "Guide",
        description: `Experienced local guide with a passion for sharing the hidden stories of Jharkhand. Specializes in eco-tourism and tribal culture.`,
        history: `Has been guiding tourists for over ${Math.floor(Math.random() * 10) + 2} years.`,
        significance: "Certified by the Jharkhand Tourism Department.",
        images: [
            guideImages[i % guideImages.length]
        ],
        location: locations[Math.floor(Math.random() * locations.length)],
        tags: ["guide", "local", ...languages[Math.floor(Math.random() * languages.length)].split(", ")],
    });
}

const seedCulture = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        await Culture.deleteMany();
        console.log("Culture collection cleared");

        await Culture.insertMany(cultureData);
        console.log(`Seeded ${cultureData.length} culture items successfully`);

        process.exit();
    } catch (error) {
        console.error("Error seeding culture data:", error);
        process.exit(1);
    }
};

seedCulture();
