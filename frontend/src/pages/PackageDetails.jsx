import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
    FaClock, FaRupeeSign, FaMapMarkerAlt, FaCheck, FaTimes, FaStar,
    FaHeart, FaRegHeart, FaLeaf, FaHiking, FaBinoculars, FaCamera,
    FaSuitcase, FaQuestionCircle, FaInfoCircle, FaPhoneAlt, FaEnvelope
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PackageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(false);

    const fetchPackageDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/packages/${id}`);
            setPkg(response.data);
        } catch (error) {
            console.error("Error fetching package details:", error);
            toast.error("Failed to load package details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackageDetails();
        // Log history
        if (user) {
            axios.post('http://localhost:5000/api/users/me/history',
                { itemId: id, type: 'package', viewedAt: new Date() },
                { withCredentials: true }
            ).catch(err => console.error("Failed to log history:", err));
        }
    }, [id, user]);

    const handleBookNow = () => {
        if (!user) {
            toast.error("Please login to book this package");
            navigate("/login", { state: { from: `/packages/${id}` } });
            return;
        }
        if (pkg.bookNowUrl) {
            window.open(pkg.bookNowUrl, "_blank");
        } else {
            toast.error("Booking link not available");
        }
    };

    useEffect(() => {
        if (user && user.wishlist) {
            const isWishlisted = user.wishlist.some(item => item.itemId === id && item.type === 'package');
            setWishlist(isWishlisted);
        }
    }, [user, id]);

    const toggleWishlist = async () => {
        if (!user) {
            toast.error("Please login to add to wishlist");
            return;
        }

        const action = wishlist ? 'remove' : 'add';
        const previousState = wishlist;
        setWishlist(!wishlist); // Optimistic update

        try {
            await axios.post('http://localhost:5000/api/users/me/wishlist',
                { itemId: id, itemType: 'package', action },
                { withCredentials: true }
            );
            toast.success(wishlist ? "Removed from wishlist" : "Added to wishlist");
        } catch (error) {
            console.error("Error updating wishlist:", error);
            setWishlist(previousState); // Revert on error
            toast.error("Failed to update wishlist");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!pkg) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 transition-colors duration-300">

            {/* --- I. TRUST & VALUE BAR (HERO) --- */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden mb-8">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url('${pkg.images?.[0] || pkg.location?.images?.[0]}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                {pkg.category}
                            </span>
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold">
                                <FaStar className="text-yellow-400" />
                                <span>{pkg.rating}</span>
                                <span className="font-normal opacity-80">({pkg.totalReviews} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-4 leading-tight">
                            {pkg.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-lg opacity-90">
                            <div className="flex items-center gap-2">
                                <FaClock className="text-primary" /> {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary" /> {pkg.location?.name || "Jharkhand"}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-24 right-8 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white transition-all duration-300 group shadow-lg"
                >
                    {wishlist ? (
                        <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                        <FaRegHeart className="text-white group-hover:text-red-500 text-2xl" />
                    )}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* --- MAIN CONTENT --- */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* --- II. CORE EXPERIENCE --- */}

                        {/* Highlights */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaStar className="text-primary" /> Experience Highlights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pkg.highlights?.map((highlight, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-200">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Itinerary */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaHiking className="text-primary" /> Day-by-Day Itinerary
                            </h2>
                            <div className="space-y-0 border-l-2 border-primary/20 ml-3">
                                {pkg.itinerary.map((item, index) => (
                                    <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-800"></div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Day {index + 1}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- III. LOGISTICS & PLANNING --- */}

                        {/* Inclusions & Exclusions */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border-t-4 border-green-500">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaCheck className="text-green-500" /> What's Included
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.inclusions.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border-t-4 border-red-500">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaTimes className="text-red-500" /> What's Not Included
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.exclusions.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Accommodation & Sustainability */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FaSuitcase className="text-primary" /> Accommodation
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">{pkg.accommodation || "Comfortable and safe accommodation provided."}</p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                                <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                                    <FaLeaf /> Sustainable Impact
                                </h3>
                                <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                                    {pkg.sustainableImpact || "This tour follows eco-friendly practices to minimize environmental impact."}
                                </p>
                            </div>
                        </section>

                        {/* Packing List */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaBinoculars className="text-primary" /> Packing Essentials
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {pkg.packingList?.map((item, index) => (
                                    <span key={index} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Map */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm h-80 overflow-hidden z-0">
                            {pkg.location?.latitude && (
                                <MapContainer
                                    center={[pkg.location.latitude, pkg.location.longitude]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    className="h-full w-full rounded-xl z-0"
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[pkg.location.latitude, pkg.location.longitude]}>
                                        <Popup>{pkg.location.name}</Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                        </section>

                        {/* --- IV. REVIEWS & FAQS --- */}

                        {/* FAQs */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaQuestionCircle className="text-primary" /> Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {pkg.faqs?.map((faq, index) => (
                                    <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* --- STICKY SIDEBAR --- */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Booking Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                                    <div className="flex items-baseline gap-1">
                                        <FaRupeeSign className="text-2xl text-primary" />
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {pkg.pricePerPerson.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">/ person</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                                        <span className="text-gray-500">Duration</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{pkg.durationDays} Days</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                                        <span className="text-gray-500">Provider</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{pkg.providerName}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                                        <span className="text-gray-500">Cancellation</span>
                                        <span className="font-medium text-green-600 text-right w-1/2">{pkg.cancellationPolicy || "Standard Policy"}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    className="w-full bg-primary hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                                >
                                    Book Now
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    Secure booking via provider website
                                </p>
                            </div>

                            {/* Contact Support */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
                                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Need Help?</h4>
                                <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
                                    Have questions before booking? Our local experts are here to help.
                                </p>
                                <div className="flex gap-4">
                                    <button className="flex-1 bg-white dark:bg-gray-800 py-2 rounded-lg text-blue-600 dark:text-blue-400 text-sm font-semibold shadow-sm hover:shadow flex items-center justify-center gap-2">
                                        <FaPhoneAlt /> Call
                                    </button>
                                    <button className="flex-1 bg-white dark:bg-gray-800 py-2 rounded-lg text-blue-600 dark:text-blue-400 text-sm font-semibold shadow-sm hover:shadow flex items-center justify-center gap-2">
                                        <FaEnvelope /> Email
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
