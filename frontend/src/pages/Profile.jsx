import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
    FiMapPin,
    FiMail,
    FiPhone,
    FiEdit2,
    FiCheck,
    FiX,
    FiHeart,
    FiClock,
    FiUser,
} from "react-icons/fi";

const API_PROFILE = "http://localhost:5000/api/auth/profile";
const API_USER_ME = "http://localhost:5000/api/users/me";
const API_USER_AVATAR = "http://localhost:5000/api/users/me/avatar";

export default function Profile() {
    const { login } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);

    /* -------------------- FORM STATE (Fix Mapping) -------------------- */
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        ageGroup: "",
        state: "",
        city: "",
        travelPreference: "",
        travelLevel: "",

        // guide fields
        experienceYears: "",
        district: "",
        village: "",
        availability: "",
        bio: "",
    });

    const [stats, setStats] = useState({
        totalWishlist: 0,
        totalHistory: 0,
        favoriteCategory: 'Places'
    });

    /* -------------------- FETCH PROFILE -------------------- */
    useEffect(() => {
        async function load() {
            try {
                const res = await axios.get(API_PROFILE, { withCredentials: true });

                setProfile(res.data);
                login(res.data); // sync auth context

                // MAP RESPONSE → FORM
                setForm({
                    name: res.data.name || "",
                    mobile: res.data.mobile || "",
                    ageGroup: res.data.ageGroup || "",
                    state: res.data.state || "",
                    city: res.data.city || "",
                    travelPreference: res.data.travelPreference || "",
                    travelLevel: res.data.travelLevel || "",
                    experienceYears: res.data.experienceYears || "",
                    district: res.data.district || "",
                    village: res.data.village || "",
                    availability: res.data.availability || "",
                    bio: res.data.bio || "",
                });

            } catch (err) {
                console.error("Profile load error:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [login]);

    /* -------------------- UPDATE STATS -------------------- */
    useEffect(() => {
        if (!profile) return;

        const wishlist = profile.wishlist || [];
        const history = profile.history || [];

        const hotels = wishlist.filter(i => i.type === 'hotel').length;
        const places = wishlist.filter(i => i.type === 'explore').length;
        const packages = wishlist.filter(i => i.type === 'package').length;

        const favoriteCategory = hotels > places && hotels > packages ? 'Hotels' : packages > places ? 'Packages' : 'Places';

        setStats({
            totalWishlist: wishlist.length,
            totalHistory: history.length,
            favoriteCategory: favoriteCategory
        });
    }, [profile]);

    /* -------------------- FORM FIELD HANDLER -------------------- */
    function handleFieldChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    /* -------------------- SAVE PROFILE -------------------- */
    async function handleSaveProfile() {
        try {
            setSaving(true);

            const res = await axios.put(
                API_USER_ME,
                {
                    ...form, // send correct fields to backend
                },
                { withCredentials: true }
            );

            setProfile(res.data);
            login(res.data);
            setEditMode(false);
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    }

    /* -------------------- AVATAR UPLOAD -------------------- */
    async function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("avatar", file);

        try {
            setAvatarUploading(true);
            const res = await axios.post(API_USER_AVATAR, fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProfile(res.data);
            login(res.data);
        } catch (err) {
            console.error("Avatar upload error:", err);
            alert("Failed to upload photo");
        } finally {
            setAvatarUploading(false);
        }
    }

    /* -------------------- READY UI -------------------- */

    if (loading)
        return (
            <div className="pt-28 text-center text-gray-500 dark:text-gray-300">
                Loading profile...
            </div>
        );

    if (!profile)
        return (
            <div className="pt-28 text-center text-gray-500">
                Please{" "}
                <Link to="/login" className="text-primary underline">
                    login
                </Link>{" "}
                to continue.
            </div>
        );

    /* Avatar logic */
    const avatarUrl = profile.avatar
        ? `http://localhost:5000${profile.avatar}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
        )}&background=1B5E20&color=fff`;

    const wishlist = profile.wishlist || [];
    const history = profile.history || [];
    const totalWishlist = wishlist.length;

    const hotels = wishlist.filter(i => i.type === 'hotel').length;
    const places = wishlist.filter(i => i.type === 'explore').length;
    const packages = wishlist.filter(i => i.type === 'package').length;

    const favoriteCategory = hotels > places && hotels > packages ? 'Hotels' : packages > places ? 'Packages' : 'Places';



    return (
        <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen px-4 md:px-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Traveller Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        Welcome back, {profile.name}.
                    </p>
                </div>

                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-1"
                                onClick={handleSaveProfile}
                            >
                                <FiCheck /> Save
                            </button>

                            <button
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center gap-1"
                                onClick={() => setEditMode(false)}
                            >
                                <FiX /> Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-1"
                            onClick={() => setEditMode(true)}
                        >
                            <FiEdit2 /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* ---------- MAIN LAYOUT (unchanged visually) ---------- */}

            <div className="grid lg:grid-cols-[2fr,1fr] gap-8">

                {/* LEFT COLUMN */}
                <div className="space-y-6">

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex gap-6">

                        {/* Avatar */}
                        <div className="text-center">
                            <div className="relative">
                                <img
                                    src={avatarUrl}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow"
                                />

                                <label className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full cursor-pointer">
                                    {avatarUploading ? "..." : "Change"}
                                    <input type="file" className="hidden" onChange={handleAvatarUpload} />
                                </label>
                            </div>

                            <p className="text-sm text-gray-500 mt-2">
                                {profile.role === "local_guide" ? "Local Guide" : "Traveller"}
                            </p>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-1">
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <FiUser />
                                {editMode ? (
                                    <input
                                        className="border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.name}
                                        onChange={(e) => handleFieldChange("name", e.target.value)}
                                    />
                                ) : (
                                    profile.name
                                )}
                            </p>

                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <FiMail /> {profile.email}
                            </p>

                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <FiPhone />
                                {editMode ? (
                                    <input
                                        className="border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.mobile}
                                        onChange={(e) => handleFieldChange("mobile", e.target.value)}
                                    />
                                ) : (
                                    profile.mobile || "Not added"
                                )}
                            </p>

                            {/* City / State */}
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <FiMapPin />
                                {(profile.city || "City") + ", " + (profile.state || "State")}
                            </p>
                        </div>
                    </div>

                    {/* Traveller Profile */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

                        <h2 className="text-lg font-semibold mb-4">Traveller Profile</h2>

                        {/* Same UI — just mapped to flat fields */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">

                            {/* Age Group */}
                            <div>
                                <label className="block text-gray-500 mb-1">Age Group</label>
                                {editMode ? (
                                    <select
                                        className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.ageGroup}
                                        onChange={(e) => handleFieldChange("ageGroup", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="18-25">18-25</option>
                                        <option value="26-40">26-40</option>
                                        <option value="40+">40+</option>
                                    </select>
                                ) : (
                                    <p>{profile.ageGroup || "-"}</p>
                                )}
                            </div>

                            {/* Travel Level */}
                            <div>
                                <label className="block text-gray-500 mb-1">Travel Level</label>
                                {editMode ? (
                                    <select
                                        className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.travelLevel}
                                        onChange={(e) => handleFieldChange("travelLevel", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Frequent Traveller">Frequent Traveller</option>
                                    </select>
                                ) : (
                                    <p>{profile.travelLevel || "-"}</p>
                                )}
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-gray-500 mb-1">State</label>
                                {editMode ? (
                                    <input
                                        className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.state}
                                        onChange={(e) => handleFieldChange("state", e.target.value)}
                                    />
                                ) : (
                                    <p>{profile.state || "-"}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-gray-500 mb-1">City</label>
                                {editMode ? (
                                    <input
                                        className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.city}
                                        onChange={(e) => handleFieldChange("city", e.target.value)}
                                    />
                                ) : (
                                    <p>{profile.city || "-"}</p>
                                )}
                            </div>

                            {/* Travel Preference */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-500 mb-1">
                                    Travel Preference
                                </label>
                                {editMode ? (
                                    <select
                                        className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                        value={form.travelPreference}
                                        onChange={(e) => handleFieldChange("travelPreference", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Wildlife">Wildlife</option>
                                        <option value="Cultural">Cultural</option>
                                    </select>
                                ) : (
                                    <p>{profile.travelPreference || "-"}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Guide Profile (same UI — mapped flat) */}
                    {profile.role === "local_guide" && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

                            <h2 className="text-lg font-semibold mb-4">Local Guide Profile</h2>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">

                                {/* Experience */}
                                <div>
                                    <label className="block text-gray-500 mb-1">
                                        Experience (years)
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                            value={form.experienceYears}
                                            onChange={(e) =>
                                                handleFieldChange("experienceYears", e.target.value)
                                            }
                                        />
                                    ) : (
                                        <p>{profile.experienceYears || "-"}</p>
                                    )}
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="block text-gray-500 mb-1">
                                        Availability
                                    </label>
                                    {editMode ? (
                                        <select
                                            className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                            value={form.availability}
                                            onChange={(e) =>
                                                handleFieldChange("availability", e.target.value)
                                            }
                                        >
                                            <option value="">Select</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="On Request">On Request</option>
                                        </select>
                                    ) : (
                                        <p>{profile.availability || "-"}</p>
                                    )}
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block text-gray-500 mb-1">
                                        District
                                    </label>
                                    {editMode ? (
                                        <input
                                            className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                            value={form.district}
                                            onChange={(e) =>
                                                handleFieldChange("district", e.target.value)
                                            }
                                        />
                                    ) : (
                                        <p>{profile.district || "-"}</p>
                                    )}
                                </div>

                                {/* Village */}
                                <div>
                                    <label className="block text-gray-500 mb-1">
                                        Village
                                    </label>
                                    {editMode ? (
                                        <input
                                            className="w-full border rounded-lg px-2 py-1 dark:bg-gray-900"
                                            value={form.village}
                                            onChange={(e) =>
                                                handleFieldChange("village", e.target.value)
                                            }
                                        />
                                    ) : (
                                        <p>{profile.village || "-"}</p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-500 mb-1">Bio</label>
                                    {editMode ? (
                                        <textarea
                                            className="w-full border rounded-lg px-2 py-2 dark:bg-gray-900"
                                            rows={3}
                                            value={form.bio}
                                            onChange={(e) => handleFieldChange("bio", e.target.value)}
                                        />
                                    ) : (
                                        <p>{profile.bio || "No bio added."}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* -------- RIGHT COLUMN -------- */}
                <div className="space-y-6">
                    {/* Snapshot + Security Cards (unchanged visuals) */}
                    {/* Snapshot */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Snapshot</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Wishlist Items</span>
                                <span className="font-medium">{stats.totalWishlist}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">History</span>
                                <span className="font-medium">{stats.totalHistory}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Favorite Category</span>
                                <span className="font-medium">{stats.favoriteCategory}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Security</h3>
                        <Link
                            to="/forgot-password"
                            className="block w-full text-center py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            Reset Password
                        </Link>
                    </div>
                </div>
            </div>

            {/* Wishlist + History section remains same (NO design changes) */}
            <div className="mt-10 grid md:grid-cols-2 gap-8">
                {/* Wishlist */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiHeart className="text-red-500" /> My Wishlist
                    </h3>
                    {totalWishlist === 0 ? (
                        <p className="text-gray-500 text-sm">No items in wishlist.</p>
                    ) : (
                        <div className="space-y-3">
                            {wishlist.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <img
                                        src={item.details?.image?.url || "https://placehold.co/100x100?text=No+Image"}
                                        className="w-12 h-12 rounded-lg object-cover"
                                        onError={(e) => e.target.src = "https://placehold.co/100x100?text=No+Image"}
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">{item.details?.name || "Item unavailable"}</p>
                                        <p className="text-xs text-gray-500 capitalize">{item.type} • {item.details?.district || "Jharkhand"}</p>
                                    </div>
                                    {item.details && (
                                        <Link
                                            to={`/${item.type === 'hotel' ? 'hotels' : item.type === 'package' ? 'packages' : 'explore'}/${item.itemId}`}
                                            className="ml-auto text-primary text-sm"
                                        >
                                            View
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* History */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiClock className="text-blue-500" /> Recently Viewed
                    </h3>
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-sm">No history yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {history.map((h, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <img
                                        src={h.details?.image?.url || "https://placehold.co/100x100?text=No+Image"}
                                        className="w-12 h-12 rounded-lg object-cover"
                                        onError={(e) => e.target.src = "https://placehold.co/100x100?text=No+Image"}
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">{h.details?.name || "Item unavailable"}</p>
                                        <p className="text-xs text-gray-500">
                                            Viewed {new Date(h.viewedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {h.details && (
                                        <Link
                                            to={`/${h.type === 'hotel' ? 'hotels' : h.type === 'package' ? 'packages' : 'explore'}/${h.itemId}`}
                                            className="ml-auto text-primary text-sm"
                                        >
                                            View
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
