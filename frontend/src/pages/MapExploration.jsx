import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiX, FiMapPin, FiStar, FiNavigation, FiInfo, FiCalendar, FiHome, FiPackage, FiUser, FiArrowLeft, FiMoreVertical, FiCoffee, FiShoppingBag, FiPenTool } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const API_BASE = "http://localhost:5000/api";

// Jharkhand Center
const CENTER = [23.6913, 85.2722];

function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
}

export default function MapExploration() {
    const [locations, setLocations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [packages, setPackages] = useState([]);
    const [guides, setGuides] = useState([]);
    const [cultureItems, setCultureItems] = useState([]);
    const [handicrafts, setHandicrafts] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Resizable Panel State
    const [panelWidth, setPanelWidth] = useState(40); // Initial width in percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [locRes, hotelRes, pkgRes, guideRes, cultureRes, handicraftRes] = await Promise.all([
                axios.get(`${API_BASE}/explore`),
                axios.get(`${API_BASE}/hotels`),
                axios.get(`${API_BASE}/packages`),
                axios.get(`${API_BASE}/guides`),
                axios.get(`${API_BASE}/culture`).catch(err => { console.warn("Culture API failed", err); return { data: [] }; }),
                axios.get(`${API_BASE}/handicrafts`).catch(err => { console.warn("Handicrafts API failed", err); return { data: [] }; }),
            ]);
            setLocations(locRes.data.filter(l =>
                (l.mapLocation?.lat && l.mapLocation?.lng) ||
                (l.coordinates?.lat && l.coordinates?.lng)
            ));
            setHotels(hotelRes.data);
            setPackages(pkgRes.data);
            setGuides(guideRes.data);
            setCultureItems(cultureRes.data);
            setHandicrafts(handicraftRes?.data || []); // Handle if route might fail or return empty
            setLoading(false);
        } catch (err) {
            console.error("Failed to load map data", err);
            // Fallback if some APIs fail
            setLoading(false);
        }
    }

    // Filter related items
    const relatedHotels = useMemo(() => {
        if (!selectedLocation) return [];
        const district = selectedLocation.district?.toLowerCase().trim();
        if (!district) return [];
        return hotels.filter(h =>
            h.district?.toLowerCase().trim() === district ||
            h.location?.toLowerCase().trim() === district
        );
    }, [selectedLocation, hotels]);

    const relatedPackages = useMemo(() => {
        if (!selectedLocation) return [];
        const district = selectedLocation.district?.toLowerCase().trim();
        if (!district) return [];
        return packages.filter(p =>
            p.location?.district?.toLowerCase().trim() === district ||
            p.title.toLowerCase().includes(district)
        );
    }, [selectedLocation, packages]);

    const relatedGuides = useMemo(() => {
        if (!selectedLocation) return [];
        const district = selectedLocation.district?.toLowerCase().trim();
        if (!district) return [];
        return guides.filter(g => g.district?.toLowerCase().trim() === district);
    }, [selectedLocation, guides]);

    const relatedFood = useMemo(() => {
        if (!selectedLocation) return [];
        const district = selectedLocation.district?.toLowerCase().trim();
        if (!district) return [];
        return cultureItems.filter(c =>
            c.category === "Cuisine" &&
            (c.location?.toLowerCase().includes(district) || c.description?.toLowerCase().includes(district))
        );
    }, [selectedLocation, cultureItems]);

    const relatedArt = useMemo(() => {
        if (!selectedLocation) return [];
        const district = selectedLocation.district?.toLowerCase().trim();
        if (!district) return [];
        return cultureItems.filter(c =>
            (c.category === "Art" || c.category === "Dance") &&
            (c.location?.toLowerCase().includes(district) || c.description?.toLowerCase().includes(district))
        );
    }, [selectedLocation, cultureItems]);

    const relatedHandicrafts = useMemo(() => {
        if (!selectedLocation) return [];
        const district = selectedLocation.district?.toLowerCase().trim();
        if (!district) return [];
        return handicrafts.filter(h => h.district?.toLowerCase().trim() === district);
    }, [selectedLocation, handicrafts]);


    // Resize Handlers
    const startResizing = useCallback(() => {
        setIsDragging(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsDragging(false);
    }, []);

    const resize = useCallback((e) => {
        if (isDragging && containerRef.current) {
            const containerWidth = containerRef.current.getBoundingClientRect().width;
            const newPanelWidth = ((containerWidth - e.clientX) / containerWidth) * 100;
            if (newPanelWidth > 20 && newPanelWidth < 70) {
                setPanelWidth(newPanelWidth);
            }
        }
    }, [isDragging]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);


    return (
        <div
            ref={containerRef}
            className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-gray-900 relative"
        >

            {/* LEFT PANEL: MAP */}
            <div
                className="h-[50vh] md:h-full relative z-0 order-2 md:order-1 transition-all duration-75 ease-linear"
                style={{ width: `calc(100% - ${panelWidth}%)` }}
            >
                {/* Back Button Overlay */}
                <div className="absolute top-6 left-6 z-[1000]">
                    <Link
                        to="/explore"
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full shadow-2xl font-medium hover:bg-white/20 transition flex items-center gap-2 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                    </Link>
                </div>

                <MapContainer
                    center={CENTER}
                    zoom={8}
                    className="w-full h-full"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {locations.map((loc) => {
                        const lat = Number(loc.coordinates?.lat || loc.mapLocation?.lat);
                        const lng = Number(loc.coordinates?.lng || loc.mapLocation?.lng);

                        if (isNaN(lat) || isNaN(lng) || !lat || !lng) return null;

                        return (
                            <Marker
                                key={loc._id}
                                position={[lat, lng]}
                                eventHandlers={{
                                    click: () => setSelectedLocation(loc),
                                }}
                            >
                            </Marker>
                        )
                    })}

                    {selectedLocation && (
                        <SetViewOnClick coords={[
                            Number(selectedLocation.coordinates?.lat || selectedLocation.mapLocation?.lat),
                            Number(selectedLocation.coordinates?.lng || selectedLocation.mapLocation?.lng)
                        ]} />
                    )}
                </MapContainer>

                {/* Debug/Empty State Overlay */}
                {locations.length === 0 && !loading && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-xl shadow-xl z-[1000]">
                        <p className="text-red-500 font-bold">No locations found with coordinates.</p>
                    </div>
                )}
            </div>

            {/* DRAG HANDLE (Desktop Only) */}
            <div
                className="hidden md:flex w-1 h-full cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-primary active:bg-primary z-50 items-center justify-center transition-colors absolute"
                style={{ left: `calc(100% - ${panelWidth}%)` }}
                onMouseDown={startResizing}
            >
                <div className="h-8 w-1 bg-gray-400 rounded-full" />
            </div>

            {/* RIGHT PANEL: DETAILS */}
            <div
                className="h-[50vh] md:h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200 dark:border-gray-800 overflow-y-auto order-1 md:order-2 shadow-2xl relative z-10 transition-all duration-75 ease-linear scrollbar-hide"
                style={{ width: window.innerWidth >= 768 ? `${panelWidth}%` : '100%' }}
            >

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p>Loading Map Data...</p>
                    </div>
                ) : !selectedLocation ? (
                    <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <FiMapPin className="text-5xl text-primary/50" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Explore Jharkhand</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                            Select a marker on the map to uncover hidden gems, luxury stays, and curated packages.
                        </p>
                    </div>
                ) : (
                    <div className="animate-fadeIn pb-20">
                        {/* Hero Image */}
                        <div className="h-72 w-full relative group">
                            <img
                                src={selectedLocation.images?.[0]?.url || selectedLocation.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
                                alt={selectedLocation.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 w-full p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-[10px] rounded-full uppercase tracking-wider font-bold shadow-lg">
                                        {selectedLocation.type || selectedLocation.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                                        <FiStar className="fill-current" /> {selectedLocation.rating?.toFixed(1) || "4.5"}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-white leading-tight mb-1">{selectedLocation.name}</h2>
                                <div className="flex items-center text-gray-300 text-sm gap-2">
                                    <FiMapPin className="text-primary" />
                                    {selectedLocation.district}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedLocation(null)}
                                className="absolute top-4 right-4 p-2.5 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8">

                            {/* Description */}
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {selectedLocation.description || selectedLocation.shortDescription || "Explore the beauty and culture of this amazing location in Jharkhand."}
                                </p>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                                        <FiCalendar />
                                        <span className="text-xs uppercase tracking-wider font-semibold">Best Time</span>
                                    </div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                        {selectedLocation.bestSeason || selectedLocation.bestTimeToVisit || "Oct - Mar"}
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                                        <FiInfo />
                                        <span className="text-xs uppercase tracking-wider font-semibold">Budget</span>
                                    </div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                        ₹{selectedLocation.averageBudget || "1000 - 5000"}
                                    </p>
                                </div>
                            </div>

                            {/* Famous Food */}
                            {relatedFood.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                        <FiCoffee className="text-primary" /> Famous Food
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {relatedFood.map((item, idx) => (
                                            <div key={idx} className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800/30">
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Handicrafts & Art */}
                            {(relatedHandicrafts.length > 0 || relatedArt.length > 0) && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                        <FiShoppingBag className="text-primary" /> Art & Handicrafts
                                    </h3>
                                    <div className="space-y-3">
                                        {relatedHandicrafts.map((item, idx) => (
                                            <div key={`craft-${idx}`} className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-3 rounded-xl">
                                                <img src={item.images?.[0] || "https://placehold.co/100"} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {relatedArt.map((item, idx) => (
                                            <div key={`art-${idx}`} className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-3 rounded-xl">
                                                <img src={item.images?.[0] || "https://placehold.co/100"} className="w-16 h-16 rounded-lg object-cover" alt={item.title} />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Related Hotels */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FiHome className="text-primary" /> Stay Nearby
                                    </h3>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                        {relatedHotels.length} Found
                                    </span>
                                </div>

                                {relatedHotels.length > 0 ? (
                                    <div className="space-y-3">
                                        {relatedHotels.slice(0, 3).map(hotel => (
                                            <Link to={`/hotels/${hotel._id}`} key={hotel._id} className="flex gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-3 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all group">
                                                <img src={hotel.images?.[0]?.url || "https://placehold.co/100"} className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform" alt={hotel.name} />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition">{hotel.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><FiMapPin size={10} /> {hotel.location}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-sm font-bold text-primary">{hotel.priceRange || "₹2000+"}</p>
                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">Hotel</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500">No hotels found nearby.</p>
                                    </div>
                                )}
                            </div>

                            {/* Related Packages */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FiPackage className="text-primary" /> Curated Packages
                                    </h3>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                        {relatedPackages.length} Found
                                    </span>
                                </div>

                                {relatedPackages.length > 0 ? (
                                    <div className="space-y-3">
                                        {relatedPackages.slice(0, 3).map(pkg => (
                                            <Link to={`/packages/${pkg._id}`} key={pkg._id} className="block bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary/50 hover:shadow-lg transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-primary/10" />

                                                <h4 className="font-bold text-gray-800 dark:text-gray-200 pr-4 group-hover:text-primary transition">{pkg.title}</h4>
                                                <div className="flex justify-between items-end mt-3">
                                                    <div>
                                                        <span className="text-xs text-gray-500 block">Duration</span>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pkg.durationDays} Days</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-gray-500 block">Starting from</span>
                                                        <span className="text-lg font-bold text-primary">₹{pkg.pricePerPerson}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500">No packages available yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Related Guides */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FiUser className="text-primary" /> Local Experts
                                    </h3>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                        {relatedGuides.length} Found
                                    </span>
                                </div>

                                {relatedGuides.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {relatedGuides.slice(0, 3).map(guide => (
                                            <div key={guide._id} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-3 rounded-2xl hover:shadow-md transition">
                                                <div className="relative">
                                                    <img src={guide.profilePicture || "https://placehold.co/100?text=Guide"} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" alt={guide.name} />
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{guide.name}</h4>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{guide.languages?.join(", ") || "English, Hindi"}</p>
                                                </div>
                                                <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition">
                                                    Contact
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500">No guides registered in this area.</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="pt-4">
                                <Link
                                    to={`/explore/${selectedLocation._id}`}
                                    className="block w-full py-4 bg-gradient-to-r from-primary to-green-600 text-white text-center rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
                                >
                                    View Full Details
                                </Link>
                            </div>

                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
