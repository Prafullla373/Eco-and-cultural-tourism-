import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import {
  FiMapPin,
  FiArrowLeft,
  FiExternalLink,
  FiPhone,
  FiX,
  FiWifi,
  FiCoffee,
  FiWind,
  FiHeart,
} from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";
import { PiBowlSteamLight } from "react-icons/pi";

const API_BASE = "http://localhost:5000/api/hotels";

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth(); // only imported once ✔

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/${id}`).then((res) => {
      setHotel(res.data);
      setLoading(false);

      // Log History
      if (user) {
        axios.post("http://localhost:5000/api/users/me/history", {
          itemId: id,
          itemType: "hotel",
          title: res.data.name
        }, { withCredentials: true }).catch(err => console.error("History log failed", err));

        // Check Wishlist Status
        // We need to know if it's in wishlist. 
        // Ideally, we should fetch user profile or pass it in.
        // For now, let's assume user object in context has it if it's updated.
        // Or we can fetch it.
        if (user.wishlist) {
          setIsWishlisted(user.wishlist.some(w => w.itemId === id));
        }
      }
    });
  }, [id, user]);

  const toggleWishlist = async () => {
    if (!user) return toast.error("Please login to wishlist.");
    setWishlistLoading(true);
    try {
      const action = isWishlisted ? "remove" : "add";
      await axios.post("http://localhost:5000/api/users/me/wishlist", {
        type: "hotel",
        itemId: id,
        action
      }, { withCredentials: true });
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!hotel) return <p className="pt-32 text-center">Hotel not found.</p>;

  const images = hotel.images || [];
  const rooms = hotel.rooms || [];
  const reviews = hotel.reviews || [];

  const BOOK_URL =
    hotel.bookNowUrl || hotel.bookingUrl || hotel.website || null;

  /* ⭐ Google Map Button */
  const openGoogleMaps = () => {
    if (!hotel.mapLocation?.lat) return alert("Location not found");

    const { lat, lng } = hotel.mapLocation;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  /* ⭐ SUBMIT REVIEW */
  async function submitReview() {
    if (!user) return alert("Please log in to write a review.");
    if (!newRating || !newComment.trim()) {
      alert("Please give rating & comment");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/${id}/review`,
        {
          rating: newRating,
          comment: newComment,
        },
        { withCredentials: true }
      );

      setHotel(res.data.hotel);
      setReviewMessage("Thank you! Your review has been submitted.");

      setNewRating(0);
      setNewComment("");

      setTimeout(() => setReviewMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 dark:bg-gray-900 px-4 md:px-10">

      {/* Back Navigation */}
      <Link to="/hotels" className="inline-flex items-center gap-1 text-gray-600">
        <FiArrowLeft /> Back to Hotels
      </Link>

      {/* Hotel Name */}
      <h1 className="mt-4 text-3xl md:text-4xl font-bold">{hotel.name}</h1>

      {/* ⭐ Rating UI */}
      <div className="mt-4 flex items-center gap-6">
        <div className="relative w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-white shadow">
          {Number(hotel.rating || 0).toFixed(1)}
        </div>

        <div className="text-gray-600">
          <p className="font-semibold">{hotel.reviews.length} guest reviews</p>
          <p className="flex items-center gap-1">
            <FiMapPin /> {hotel.location}, {hotel.district}
          </p>
        </div>
      </div>

      {/* Hero Images */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-xl overflow-hidden shadow-lg">
          <img
            src={images[0]?.url}
            onClick={() => setActiveImage(images[0]?.url)}
            className="h-80 w-full object-cover cursor-pointer hover:scale-105 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {images.slice(1, 5).map((img, i) => (
            <img
              key={i}
              src={img.url}
              onClick={() => setActiveImage(img.url)}
              className="h-36 w-full object-cover rounded-xl cursor-pointer hover:scale-110 transition"
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => BOOK_URL && window.open(BOOK_URL, "_blank")}
          disabled={!BOOK_URL}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow ${BOOK_URL
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          <FiExternalLink /> Book Now
        </button>

        {hotel.contactPhone && (
          <a
            href={`tel:${hotel.contactPhone}`}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPhone /> Call
          </a>
        )}

        <button
          onClick={openGoogleMaps}
          className="px-6 py-3 rounded-xl bg-yellow-500 text-gray-900 font-semibold shadow hover:bg-yellow-600 flex items-center gap-2"
        >
          <FiMapPin /> Get Directions
        </button>

        <button
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          className={`px-6 py-3 rounded-xl font-semibold shadow flex items-center gap-2 transition ${isWishlisted
            ? "bg-red-100 text-red-600 border border-red-200"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
        >
          <FiHeart className={isWishlisted ? "fill-current" : ""} />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
      </div>

      {/* Description */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold">About {hotel.name}</h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          {hotel.description || hotel.shortDescription}
        </p>
      </div>

      {/* Rooms */}
      {rooms.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">Rooms</h2>

          {rooms.map((room, i) => (
            <div key={i} className="mt-5 p-4 border rounded-xl">
              <h3 className="text-lg font-semibold">{room.type}</h3>
              <p className="text-primary font-semibold mt-1">₹ {room.price}</p>
              <p className="text-sm text-gray-500">Max Guests: {room.maxGuests}</p>

              <div className="mt-2 flex gap-3">
                {room.amenities.map((a, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Amenities */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold">Amenities</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
          {hotel.amenities.map((am, i) => (
            <Amenity key={i} name={am} />
          ))}
        </div>
      </div>

      {/* ⭐⭐ REVIEWS ⭐⭐ */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold">Guest Reviews</h2>

        {user ? (
          <div className="mt-4 p-4 border rounded-xl">
            <h3 className="font-semibold mb-2">Write a Review</h3>

            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setNewRating(star)}>
                  <span
                    className={`text-3xl ${newRating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border rounded-xl dark:bg-gray-700"
              placeholder="Share your experience..."
              rows="3"
            />

            <button
              onClick={submitReview}
              className="mt-3 px-5 py-2 bg-primary text-white rounded-xl shadow"
            >
              Submit Review
            </button>

            {reviewMessage && (
              <p className="mt-2 text-green-600">{reviewMessage}</p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">
            Please{" "}
            <Link to="/login" className="text-primary underline">
              login
            </Link>{" "}
            to write a review.
          </p>
        )}

        {/* Existing Reviews */}
        {reviews.length === 0 ? (
          <p className="mt-3 text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="mt-4 border-b pb-3">
              <div className="font-semibold">{r.userName}</div>
              <div className="text-yellow-400 font-semibold text-lg">
                ★ {Number(r.rating).toFixed(1)}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Image Popup */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            <FiX />
          </button>

          <img
            src={activeImage}
            className="max-w-[90%] max-h-[90%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

/* Amenity Component */
function Amenity({ name }) {
  const ICON = {
    WiFi: <FiWifi />,
    Restaurant: <FiCoffee />,
    Parking: <IoCarSportOutline />,
    AC: <FiWind />,
    Breakfast: <PiBowlSteamLight />,
  }[name];

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">
      {ICON || "•"} {name}
    </div>
  );
}
