import { motion } from "framer-motion";

const CATEGORIES = [
    "Festivals", "Music", "Dance", "Artisans", "Temples", "Tribal Culture", "Local Guides"
];

export default function CulturalHero({ onCategoryClick }) {
    return (
        <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center px-4 overflow-hidden rounded-3xl shadow-2xl mb-10">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590050752117-238cb0fb9d64?q=80&w=1974&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold font-heading mb-4"
                >
                    Cultural Heritage of Jharkhand
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
                >
                    Discover the soul of the land through its festivals, art, music, and people.
                </motion.p>

                {/* Category Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {CATEGORIES.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => onCategoryClick(cat)}
                            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all text-sm font-medium"
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
