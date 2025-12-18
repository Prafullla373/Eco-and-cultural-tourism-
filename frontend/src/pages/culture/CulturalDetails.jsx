import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMapPin, FiCalendar, FiClock, FiDollarSign } from "react-icons/fi";

export default function CulturalDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We can reuse the explore endpoint or create a specific one. 
        // Since we unified data in backend, we can try fetching from /api/explore/{id} 
        // OR /api/events/{id} depending on type.
        // However, our unified grid returned mixed types.
        // Let's try to fetch from explore first (covers locations), if fail try event.
        // Ideally backend should provide a unified /api/culture/{id} but we didn't make that yet.
        // Let's assume we use the Explore endpoint for locations and Events endpoint for events.
        // But we don't know the type here easily without query param or trial.
        // Let's try fetching as Location (Explore) first.

        const load = async () => {
            try {
                // Try Location/Explore first
                let res = await axios.get(`http://localhost:5000/api/explore/${id}`);
                setItem({ ...res.data, type: "location" });
            } catch (e) {
                try {
                    // Try Event
                    let res = await axios.get(`http://localhost:5000/api/events/${id}`);
                    setItem({ ...res.data, type: "event" });
                } catch (err) {
                    console.error("Not found");
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (!item) return <div className="p-20 text-center">Item not found</div>;

    const isEvent = item.type === "event" || item.date; // Check structure

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            {/* Hero Banner */}
            <div className="h-[50vh] relative">
                <img
                    src={item.images?.[0] || item.image || "https://via.placeholder.com/1200x600"}
                    className="w-full h-full object-cover"
                    alt={item.title || item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                    <div className="text-white max-w-4xl">
                        <span className="px-3 py-1 bg-primary text-xs font-bold rounded uppercase mb-2 inline-block">
                            {item.category || item.type}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title || item.name}</h1>
                        <div className="flex flex-wrap gap-6 text-lg">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-primary" />
                                {item.location || item.district}
                            </div>
                            {isEvent && (
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-primary" />
                                    {new Date(item.date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Overview</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            {item.description || item.shortDescription}
                        </p>
                    </section>

                    {/* Gallery */}
                    {item.images?.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {item.images.map((img, idx) => (
                                    <img key={idx} src={img} className="rounded-xl h-48 w-full object-cover hover:scale-105 transition-transform" />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-6">Key Details</h3>

                        <div className="space-y-4">
                            {isEvent && (
                                <>
                                    <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                                        <span className="text-gray-500 flex items-center gap-2"><FiClock /> Time</span>
                                        <span className="font-semibold">10:00 AM</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                                        <span className="text-gray-500 flex items-center gap-2"><FiDollarSign /> Entry Fee</span>
                                        <span className="font-semibold">{item.price > 0 ? `₹${item.price}` : "Free"}</span>
                                    </div>
                                </>
                            )}

                            {!isEvent && (
                                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                                    <span className="text-gray-500">Best Time</span>
                                    <span className="font-semibold">{item.bestTimeToVisit || "Oct - Mar"}</span>
                                </div>
                            )}
                        </div>

                        <button className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30">
                            {isEvent ? "Book Tickets" : "Plan Visit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
