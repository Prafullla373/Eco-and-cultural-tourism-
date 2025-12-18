import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMapPin, FiCheckCircle, FiXCircle, FiCalendar, FiUser, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function GuideDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState("");
    const [peopleCount, setPeopleCount] = useState(1);
    const [message, setMessage] = useState("");
    const [bookingStatus, setBookingStatus] = useState("idle"); // idle, checking, available, unavailable, booked

    useEffect(() => {
        fetchGuide();
    }, [id]);

    const fetchGuide = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/guides/${id}`);
            setGuide(res.data);
        } catch (error) {
            toast.error("Failed to load guide details");
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!bookingDate) return toast.error("Please select a date");

        setBookingStatus("checking");
        // Simulate real-time check delay
        setTimeout(() => {
            if (guide.availability === "Available" || guide.availability === "full-time") {
                setBookingStatus("available");
            } else {
                setBookingStatus("unavailable");
            }
        }, 1500);
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please login to book a guide");
            return navigate("/login");
        }

        try {
            await axios.post("http://localhost:5000/api/bookings", {
                type: "guide",
                targetId: id,
                date: bookingDate,
                peopleCount,
                message
            }, { withCredentials: true });

            toast.success("Booking request sent! Guide notified via WhatsApp.");
            setBookingStatus("booked");
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Guide Profile...</div>;
    if (!guide) return <div className="p-20 text-center">Guide not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-10 px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

                {/* Left: Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center sticky top-24">
                        <img
                            src={guide.avatar || "https://via.placeholder.com/150"}
                            alt={guide.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20"
                        />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{guide.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">{guide.experienceYears}+ Years Experience</p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <FiMapPin className="text-primary" />
                            <span>{guide.village}, {guide.district}</span>
                        </div>

                        <div className="text-left space-y-3 mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase text-gray-400">Languages</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {guide.languages?.map(lang => (
                                        <span key={lang} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{lang}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase text-gray-400">Expertise</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {guide.expertise?.map(exp => (
                                        <span key={exp} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{exp}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={`p-3 rounded-lg text-sm font-semibold ${guide.availability === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            Currently: {guide.availability || "Unavailable"}
                        </div>
                    </div>
                </div>

                {/* Right: Bio & Booking */}
                <div className="md:col-span-2 space-y-6">

                    {/* Bio */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">About Me</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {guide.bio || "No bio available."}
                        </p>
                    </div>

                    {/* Booking Widget */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-primary/10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FiCalendar className="text-primary" /> Book This Guide
                        </h2>

                        {bookingStatus === "booked" ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-green-700 mb-2">Request Sent!</h3>
                                <p className="text-gray-500">
                                    {guide.name} has been notified via WhatsApp.<br />
                                    Check your dashboard for status updates.
                                </p>
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">People</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={peopleCount}
                                            onChange={(e) => setPeopleCount(e.target.value)}
                                            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Message to Guide</label>
                                    <textarea
                                        rows="3"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell me about your trip plan..."
                                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>

                                {bookingStatus === "idle" && (
                                    <button
                                        onClick={checkAvailability}
                                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors"
                                    >
                                        Check Availability
                                    </button>
                                )}

                                {bookingStatus === "checking" && (
                                    <button disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold flex items-center justify-center gap-2">
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></span>
                                        Checking Schedule...
                                    </button>
                                )}

                                {bookingStatus === "unavailable" && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                                        <FiXCircle size={24} />
                                        <div>
                                            <p className="font-bold">Guide Unavailable</p>
                                            <p className="text-sm">Please choose another date or guide.</p>
                                        </div>
                                        <button onClick={() => setBookingStatus("idle")} className="ml-auto text-sm underline">Retry</button>
                                    </div>
                                )}

                                {bookingStatus === "available" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                                            <FiCheckCircle size={24} />
                                            <div>
                                                <p className="font-bold">Available!</p>
                                                <p className="text-sm">You can proceed with booking.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleBooking}
                                            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all"
                                        >
                                            Confirm Booking Request
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
