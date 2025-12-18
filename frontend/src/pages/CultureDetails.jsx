import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaHistory, FaInfoCircle, FaTags } from "react-icons/fa";

export default function CultureDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/culture/${id}`);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching culture details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 transition-colors duration-300">

            {/* Hero Banner */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.images[0]}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto">
                    <Link to="/culture" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <FaArrowLeft /> Back to Culture
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-4 py-1 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider mb-4">
                            {item.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white font-playfair mb-4 leading-tight">
                            {item.title}
                        </h1>
                        {item.location && (
                            <div className="flex items-center gap-2 text-xl text-gray-300">
                                <FaMapMarkerAlt className="text-primary" />
                                <span>{item.location}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaInfoCircle className="text-primary" /> About
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        {/* History & Significance */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FaHistory className="text-primary" /> History & Origins
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {item.history || "Historical details not available."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FaTags className="text-primary" /> Cultural Significance
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {item.significance || "Significance details not available."}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Gallery */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Gallery */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {item.images.map((img, index) => (
                                    <div key={index} className="rounded-xl overflow-hidden h-48 shadow-sm hover:shadow-md transition-shadow">
                                        <img
                                            src={img}
                                            alt={`${item.title} ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

        </div>
    );
}
