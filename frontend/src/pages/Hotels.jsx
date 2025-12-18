import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FiMapPin,
  FiArrowRight,
  FiExternalLink,
  FiSearch,
  FiHeart,
  FiWifi,
  FiCoffee,
  FiWind,
} from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";
import { PiBowlSteamLight } from "react-icons/pi";

const API_BASE = "http://localhost:5000/api/hotels";

/* ---- FULL DISTRICT LIST ---- */
const DISTRICTS = [
  "Ranchi",
  "Deoghar",
  "Jamshedpur",
  "Netarhat",
  "Hazaribagh",
  "Dhanbad",
  "Ramgarh",
  "Gumla",
  "Latehar",
  "Bokaro",
  "Giridih",
  "Chaibasa",
  "Khunti",
  "Simdega",
  "Godda",
  "Dumka",
];

const PRICE_TAGS = [
  { label: "All Prices", value: "" },
  { label: "Below ₹1500", value: "<1500" },
  { label: "₹1500 - ₹3000", value: "1500-3000" },
  { label: "₹3000 - ₹6000", value: "3000-6000" },
  { label: "Above ₹6000", value: ">6000" },
];

const AMENITY_LIST = [
  { name: "WiFi", icon: <FiWifi /> },
  { name: "Restaurant", icon: <FiCoffee /> },
  { name: "Parking", icon: <IoCarSportOutline /> },
  { name: "AC", icon: <FiWind /> },
  { name: "Breakfast", icon: <PiBowlSteamLight /> },
];

export default function Hotels() {
  const { user } = useAuth();

  const [hotels, setHotels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  /* ------------------- LOAD HOTELS ------------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(API_BASE);
        setHotels(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to load hotels:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ------------------- AMENITY TOGGLE ------------------- */
  function toggleAmenity(am) {
    setAmenities((prev) =>
      prev.includes(am) ? prev.filter((x) => x !== am) : [...prev, am]
    );
  }

  /* ------------------- PRICE HELPER ------------------- */
  function getMinPrice(hotel) {
    if (!hotel.priceRange) return null;
    const num = parseInt(hotel.priceRange.replace(/\D/g, ""), 10);
    return Number.isNaN(num) ? null : num;
  }

  /* ------------------- WISHLIST (HOOKED TO BACKEND) ------------------- */
  async function toggleWishlist(id) {
    if (!user) {
      alert("Please login to use wishlist.");
      return;
    }

    const isNowWishlisted = !wishlist.includes(id);

    // optimistic UI update
    setWishlist((prev) =>
      isNowWishlisted ? [...prev, id] : prev.filter((x) => x !== id)
    );

    try {
      await axios.post(
        "http://localhost:5000/api/users/me/wishlist",
        {
          type: "hotel",
          itemId: id,
          action: isNowWishlisted ? "add" : "remove",
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to update wishlist:", err);

      // revert on error
      setWishlist((prev) =>
        isNowWishlisted ? prev.filter((x) => x !== id) : [...prev, id]
      );

      if (err.response?.status === 401) {
        alert("Session expired. Please login again to use wishlist.");
      } else {
        alert("Could not update wishlist. Please try again.");
      }
    }
  }

  /* ------------------- FILTER HOTELS ------------------- */
  useEffect(() => {
    let data = [...hotels];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((h) => h.name.toLowerCase().includes(q));
    }

    if (district) {
      data = data.filter((h) => h.district === district);
    }

    if (rating) {
      const r = Number(rating);
      data = data.filter((h) => (h.rating || 0) >= r);
    }

    if (price) {
      data = data.filter((h) => {
        const p = getMinPrice(h);
        if (p == null) return false;
        if (price === "<1500") return p < 1500;
        if (price === "1500-3000") return p >= 1500 && p <= 3000;
        if (price === "3000-6000") return p >= 3000 && p <= 6000;
        if (price === ">6000") return p > 6000;
        return true;
      });
    }

    if (amenities.length > 0) {
      data = data.filter((h) =>
        amenities.every((am) => h.amenities?.includes(am))
      );
    }

    setFiltered(data);
  }, [search, district, rating, price, amenities, hotels]);

  /* ------------------- LOADING ------------------- */
  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-500 dark:text-gray-300">
        Loading hotels...
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HERO */}
      <section className="mx-4 md:mx-10 mb-10 rounded-3xl overflow-hidden shadow-xl relative">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
          alt="Jharkhand Hotels"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black/45 flex flex-col justify-center px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
            Hotels, Resorts & Stays in Jharkhand
          </h1>
          <p className="mt-3 text-gray-100 max-w-2xl">
            Discover curated stays across Ranchi, Netarhat, Deoghar, Jamshedpur
            and more — resorts, luxury hotels, homestays & eco-stays.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="mx-4 md:mx-10 mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* SEARCH */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotel name..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* DISTRICT */}
          <select
            className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* RATING */}
          <select
            className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
          </select>

          {/* PRICE */}
          <select
            className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            {PRICE_TAGS.map((p) => (
              <option key={p.value || "all"} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* AMENITIES */}
        <div className="mt-4 flex flex-wrap gap-2">
          {AMENITY_LIST.map((a) => {
            const active = amenities.includes(a.name);
            return (
              <button
                key={a.name}
                type="button"
                onClick={() => toggleAmenity(a.name)}
                className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                }`}
              >
                {a.icon}
                {a.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID */}
      <section className="mx-4 md:mx-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No hotels match your filters.
          </p>
        )}

        {filtered.map((hotel) => (
          <HotelCard
            key={hotel._id}
            hotel={hotel}
            isWishlisted={wishlist.includes(hotel._id)}
            onToggleWishlist={() => toggleWishlist(hotel._id)}
          />
        ))}
      </section>
    </div>
  );
}

/* -------------------- HOTEL CARD -------------------- */
function HotelCard({ hotel, isWishlisted, onToggleWishlist }) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={hotel.images?.[0]?.url}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* WISHLIST */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-3 right-3 bg-white/85 backdrop-blur px-2.5 py-2 rounded-full shadow"
        >
          <FiHeart
            className={`text-xl transition ${
              isWishlisted ? "text-red-500 fill-red-500" : "text-gray-700"
            }`}
          />
        </button>

        {/* RATING */}
        <div className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-xl shadow text-xs font-semibold">
          ⭐ {hotel.rating ? hotel.rating.toFixed(1) : "4.0"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition">
          {hotel.name}
        </h2>

        {/* LOCATION */}
        <div className="mt-1 flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <FiMapPin className="text-primary" />
          <span>
            {hotel.location}, {hotel.district}
          </span>
        </div>

        {/* AMENITIES */}
        <div className="mt-3 flex gap-3 text-gray-700 dark:text-gray-200 text-lg">
          {hotel.amenities?.includes("WiFi") && <FiWifi />}
          {hotel.amenities?.includes("Restaurant") && <FiCoffee />}
          {hotel.amenities?.includes("Parking") && <IoCarSportOutline />}
          {hotel.amenities?.includes("AC") && <FiWind />}
          {hotel.amenities?.includes("Breakfast") && <PiBowlSteamLight />}
        </div>

        {/* PRICE */}
        <p className="mt-4 text-sm font-semibold text-primary">
          {hotel.priceRange || "Price on request"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Approx. per night
        </p>

        {/* BUTTONS */}
        <div className="mt-5 flex gap-3">
          <Link
            to={`/hotels/${hotel._id}`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition flex items-center justify-center gap-1"
          >
            View Details <FiArrowRight />
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const url = hotel.bookNowUrl || hotel.officialSite;
              if (url && url.length > 5) {
                window.open(url, "_blank", "noopener,noreferrer");
              } else {
                alert("Sorry, booking link is not available for this hotel");
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold
             shadow hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition
             flex items-center justify-center gap-2"
          >
            Book Now <FiExternalLink />
          </button>
        </div>
      </div>
    </div>
  );
}
