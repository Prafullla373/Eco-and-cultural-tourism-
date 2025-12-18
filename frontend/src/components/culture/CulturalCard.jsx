import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiStar, FiUser } from "react-icons/fi";

export default function CulturalCard({ item }) {
    const isGuide = item.cardType === "guide";
    const isEvent = item.cardType === "event";

    const linkPath = isGuide
        ? `/culture/guide/${item._id}`
        : `/culture/details/${item._id}`; // Unified details page for places/events

    const image = item.images?.[0] || item.avatar || item.image || "https://via.placeholder.com/400x300";

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                        {item.category || item.type}
                    </span>
                </div>
                {isGuide && item.availability && (
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.availability === "Available" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            }`}>
                            {item.availability}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {item.name || item.title}
                </h3>

                <div className="space-y-2 mb-4 flex-1">
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiMapPin className="mr-2 text-primary" />
                        <span className="truncate">{item.district || item.location || "Jharkhand"}</span>
                    </div>

                    {/* Date (Event) or Experience (Guide) */}
                    {isEvent && item.date && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiCalendar className="mr-2 text-primary" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                    )}
                    {isGuide && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiUser className="mr-2 text-primary" />
                            <span>{item.experienceYears || 0}+ Years Exp.</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <div className="flex items-center text-yellow-500 text-sm font-bold">
                        <FiStar className="mr-1 fill-current" />
                        {item.rating || "4.5"}
                    </div>

                    <Link
                        to={linkPath}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                        {isGuide ? "Book Guide" : "View Details"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
