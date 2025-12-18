import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import {
  FiStar,
  FiMapPin,
  FiExternalLink,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiGlobe,
  FiNavigation,
  FiInfo,
  FiCamera,
  FiArrowLeft,
  FiShare2,
  FiX
} from "react-icons/fi";
import { FaCar, FaTrain, FaPlane } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000/api";

export default function ExploreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/explore/${id}`);
        const data = res.data;
        setItem(data);

        // 🔥 PUSH TO USER VIEW HISTORY (non-blocking)
        axios.post(`${API_BASE}/users/me/history`, { type: "explore", itemId: id }, { withCredentials: true }).catch(() => { });

        // load related
        const relRes = await axios.get(`${API_BASE}/explore?category=${encodeURIComponent(data.type)}`);
        const filtered = relRes.data.filter((x) => x._id !== id);
        setRelated(
          filtered.slice(0, 10).map((el) => ({
            id: el._id,
            title: el.name,
            categoryLabel: el.type,
            location: el.district,
            href: `/explore/${el._id}`,
            thumbnail: el.images?.[0],
          }))
        );
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/explore");
      }
    }
    load();
  }, [id, navigate]);

  const reviews = item?.reviews || [];
  const rating = item?.rating || 0;

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.rating || 0);
      if (dist[rounded] !== undefined) dist[rounded] += 1;
    });
    const total = reviews.length || 1;
    Object.keys(dist).forEach((k) => {
      dist[k] = { count: dist[k], percentage: (dist[k] / total) * 100 };
    });
    return dist;
  }, [reviews]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-500 dark:text-gray-300 text-lg font-medium">
          Loading amazing places...
        </div>
      </div>
    );
  }

  if (!item) return null;

  const images = item.images && item.images.length > 0 ? item.images : ["https://placehold.co/1200x600?text=No+Image"];
  const coordinates = item.coordinates?.lat ? item.coordinates : null;

  // Visit Plan
  function handleVisitPlan() {
    let plan = "Suggested Visit Plan:\n\n• Start early\n• Spend 2–3 hours exploring\n• Explore nearby food spots\n• Carry water and camera\n";
    if (item.type === "wildlife") plan = "Wildlife Visit Plan:\n\n• Early morning safari\n• Birdwatching\n• Lunch break\n• Evening return\n";
    else if (item.type === "waterfall") plan = "Waterfall Visit Plan:\n\n• Visit early morning\n• Avoid slippery rocks\n• Carry extra clothes\n";
    alert(plan);
  }

  // Share Handler
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out ${item.name} in ${item.district}, Jharkhand!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  // Submit Review Handler
  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!newRating || !newComment.trim()) {
      alert("Please provide rating and comment.");
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await axios.post(`${API_BASE}/explore/${id}/review`, { rating: newRating, comment: newComment }, { withCredentials: true });
      const data = res.data;
      setItem({ ...item, reviews: [data.review, ...(item.reviews || [])], rating: data.rating, numReviews: data.numReviews });
      setNewRating(0);
      setNewComment("");
    } catch (err) {
      if (err.response?.status === 401) alert("Please login to submit a review.");
      else alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      {/* --- HERO IMAGE SLIDER --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-200 dark:bg-gray-800 group">

        {/* Back Button (Absolute Top Left) */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition shadow-lg"
          title="Go Back"
        >
          <FiArrowLeft size={24} />
        </button>

        {/* Share Button (Absolute Top Right) */}
        <button
          onClick={handleShare}
          className="absolute top-24 right-4 md:right-8 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition shadow-lg"
          title="Share"
        >
          <FiShare2 size={24} />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="w-full h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <img
                  src={img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/1200x600?text=Image+Not+Found"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm md:text-base font-medium text-yellow-400 mb-2 uppercase tracking-wider">
                <span>{item.type.replace(/_/g, " ")}</span>
                <span>•</span>
                <span>{item.district}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 drop-shadow-lg">
                {item.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg text-gray-200">
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <FiStar className="text-yellow-400 fill-current" />
                  {rating.toFixed(1)} ({item.numReviews || reviews.length} reviews)
                </span>
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <FiClock /> {item.bestTimeToVisit || "All Year"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid lg:grid-cols-[2fr,1fr] gap-10">
        {/* --- LEFT COLUMN: DETAILS --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* About Section */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <FiInfo className="text-primary" /> About {item.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {item.description || item.shortDescription}
            </p>

            {/* Quick Actions Bar - Distinct Colors */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleVisitPlan}
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-amber-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-amber-600 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <FiClock /> Visit Plan
              </button>

              <a
                href={
                  coordinates
                    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + item.district + " Jharkhand")}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <FiNavigation /> Directions
              </a>

              <button
                onClick={() => {
                  const target = item.bookNowUrl || item.officialSite || `https://www.google.com/search?q=${encodeURIComponent(item.name + " " + item.district + " Jharkhand tourism")}`;
                  window.open(target, "_blank", "noopener,noreferrer");
                }}
                className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <FiExternalLink /> {item.bookNowUrl ? "Book Now" : "More Info"}
              </button>
            </div>
          </section>

          {/* How to Reach Section */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <FiMapPin className="text-primary" /> How to Reach
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 text-xl">
                  <FaPlane />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">By Air</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nearest Airport: Ranchi (IXR)</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 text-xl">
                  <FaTrain />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">By Train</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nearest Station: {item.district} Jn.</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3 text-xl">
                  <FaCar />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">By Road</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.howToReach || "Well connected by road."}</p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visitor Reviews</h2>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                {rating.toFixed(1)} <FiStar className="fill-current" />
              </div>
            </div>

            {/* Submit Review Form - AUTH PROTECTED */}
            {user ? (
              <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Write a Review</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setNewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <FiStar className={`text-2xl ${newRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border-0 bg-white dark:bg-gray-800 p-3 text-sm shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Share your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" disabled={submittingReview} className="mt-3 px-6 py-2 rounded-xl bg-primary text-white font-medium hover:bg-green-700 transition disabled:opacity-50">
                  {submittingReview ? "Posting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center">
                <p className="text-blue-700 dark:text-blue-300">
                  Please <Link to="/login" className="font-bold underline">login</Link> to write a review.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((rev, i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{rev.userName || "Visitor"}</p>
                      <div className="flex text-yellow-400 text-xs mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < Math.round(rev.rating) ? "fill-current" : "text-gray-300 dark:text-gray-600"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{rev.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-gray-500 italic">No reviews yet. Be the first!</p>}
            </div>
          </section>
        </motion.div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Key Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <FiDollarSign className="text-2xl text-green-500 mb-2" />
              <p className="text-xs text-gray-500 uppercase font-semibold">Budget</p>
              <p className="font-bold text-gray-900 dark:text-white">₹{item.averageBudget || "500"}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <FiClock className="text-2xl text-blue-500 mb-2" />
              <p className="text-xs text-gray-500 uppercase font-semibold">Best Time</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{item.bestTimeToVisit || "All Year"}</p>
            </div>
          </div>

          {/* Map Widget */}
          {coordinates && (
            <div className="bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="h-64 w-full rounded-2xl overflow-hidden relative z-0">
                <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                  <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[coordinates.lat, coordinates.lng]}>
                    <Popup>{item.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="p-3 text-center">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  View Larger Map
                </a>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {(item.contactPhone || item.contactEmail || item.officialSite) && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact Info</h3>
              <div className="space-y-3">
                {item.contactPhone && (
                  <a href={`tel:${item.contactPhone}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><FiPhone /></div>
                    <span className="text-sm">{item.contactPhone}</span>
                  </a>
                )}
                {item.contactEmail && (
                  <a href={`mailto:${item.contactEmail}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><FiMail /></div>
                    <span className="text-sm">{item.contactEmail}</span>
                  </a>
                )}
                {item.officialSite && (
                  <a href={item.officialSite} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><FiGlobe /></div>
                    <span className="text-sm truncate">Official Website</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Related Attractions */}
          {related.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Nearby Places</h3>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link key={r.id} to={r.href} className="flex gap-3 group">
                    <img
                      src={r.thumbnail || "https://placehold.co/100x100?text=No+Img"}
                      alt={r.title}
                      className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img"; }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary transition">{r.title}</h4>
                      <p className="text-xs text-gray-500">{r.location}</p>
                      <span className="text-[10px] uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {r.categoryLabel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>

      {/* Fullscreen Lightbox */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            <FiX />
          </button>

          <img
            src={activeImage}
            alt="full"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
