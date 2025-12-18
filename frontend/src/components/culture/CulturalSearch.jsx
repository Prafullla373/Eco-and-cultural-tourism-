import { FiSearch, FiCalendar, FiMapPin, FiFilter } from "react-icons/fi";

export default function CulturalSearch({ filters, setFilters }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg mb-10 -mt-20 relative z-20 mx-4 md:mx-10 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Search */}
                <div className="relative md:col-span-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events, guides..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                </div>

                {/* Location */}
                <div className="relative md:col-span-1">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                    >
                        <option value="All">All Locations</option>
                        <option value="Ranchi">Ranchi</option>
                        <option value="Jamshedpur">Jamshedpur</option>
                        <option value="Deoghar">Deoghar</option>
                        <option value="Hazaribagh">Hazaribagh</option>
                        <option value="Dhanbad">Dhanbad</option>
                    </select>
                </div>

                {/* Category */}
                <div className="relative md:col-span-1">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                    >
                        <option value="All">All Categories</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Music">Music</option>
                        <option value="Dance">Dance</option>
                        <option value="Artisans">Artisans</option>
                        <option value="Temples">Temples</option>
                        <option value="Local Guides">Local Guides</option>
                    </select>
                </div>

                {/* Date / Availability */}
                <div className="relative md:col-span-1">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
