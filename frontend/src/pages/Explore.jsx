import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ExploreHero from "../components/explore/ExploreHero"; // ⭐ KEEP HERO SECTION
import { FiSearch, FiMap, FiGrid } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api";

export default function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    location: "All",
    minRating: 0,
  });

  const [viewType, setViewType] = useState("grid");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/explore`);
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Explore fetch error:", err);
    }
  }

  const locations = [...new Set(items.map((x) => x.district))];
  const categories = [...new Set(items.map((x) => x.type))];

  const filteredItems = items.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.district.toLowerCase().includes(filters.search.toLowerCase());

    const categoryMatch =
      filters.category === "All" || item.type === filters.category;

    const locationMatch =
      filters.location === "All" || item.district === filters.location;

    const ratingMatch = filters.minRating === 0 || item.rating >= filters.minRating;

    return searchMatch && categoryMatch && locationMatch && ratingMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 md:px-10">

      {/* ⭐ EXPLORE HERO BANNER ON TOP */}
      <div className="mb-10">
        <ExploreHero />
      </div>

      {/* ⭐ SEARCH + FILTER BAR */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg mb-10 flex flex-col md:flex-row gap-4 items-center">

        {/* Search Input */}
        <div className="flex items-center w-full md:w-[40%] bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
          <FiSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search places, locations..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((p) => ({ ...p, category: e.target.value }))
          }
          className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100 capitalize"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((p) => ({ ...p, location: e.target.value }))
          }
          className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100"
        >
          <option value="All">All Locations</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Rating */}
        <select
          value={filters.minRating}
          onChange={(e) =>
            setFilters((p) => ({ ...p, minRating: Number(e.target.value) }))
          }
          className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4★ & above</option>
          <option value={3}>3★ & above</option>
          <option value={2}>2★ & above</option>
        </select>

        {/* View Switch Buttons */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <button
            onClick={() => setViewType("grid")}
            className={`p-3 rounded-xl ${viewType === "grid" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
          >
            <FiGrid />
          </button>

          <Link
            to="/explore/map"
            className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-gray-600 dark:text-gray-300"
          >
            <FiMap />
          </Link>
        </div>
      </div>

      {/* ⭐ EXPLORE RESULTS GRID */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 dark:text-gray-300">
          Loading Explore Items…
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center text-gray-500 dark:text-gray-300">
          No matching results found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={item.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                  {item.type.replace(/_/g, " ")}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {item.shortDescription}
                </p>

                {/* Rating + Location */}
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>📍 {item.district}</span>
                  <span>⭐ {item.rating?.toFixed(1) || "4.0"}</span>
                </div>

                {/* ⭐ View Details Button */}
                <Link
                  to={`/explore/${item._id}`}
                  className="mt-4 inline-block w-full text-center bg-primary text-white py-2 rounded-xl hover:bg-green-700 transition font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
