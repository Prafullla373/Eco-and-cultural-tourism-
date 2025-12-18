import { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock, FaIdBadge } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/roleRedirect";

const ADMIN_ROLES = [
    { value: "super_admin", label: "Super Admin", desc: "Full system access, create admins" },
    { value: "hotel_manager", label: "Hotel Manager", desc: "Manage Hotels CRUD" },
    { value: "cultural_manager", label: "Cultural Tourism Manager", desc: "Manage cultural tourist places" },
    { value: "eco_manager", label: "Eco Tourism Manager", desc: "Manage eco categories (falls, wildlife)" },
    { value: "event_manager", label: "Event Organizer Admin", desc: "Manage events & festivals" },
    { value: "package_manager", label: "Package Admin", desc: "Manage travel packages" },
];

export default function AdminRegister() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const selectedRole = watch("role");

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", data, {
                withCredentials: true,
            });

            const user = res.data.user;

            // Auto-login after registration
            login(user);
            toast.success("Admin registered successfully!");

            // Redirect based on role
            const redirectPath = getDashboardPath(user.role);
            navigate(redirectPath);

        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1623492701902-47dc207df5b1?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center relative py-10">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl text-white"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-yellow-600/80 rounded-full mb-4 shadow-lg shadow-yellow-500/30">
                        <FaUserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-center font-playfair">Admin Registration</h2>
                    <p className="text-gray-300 text-sm mt-1">Join the Jharkhand Tourism Management Team</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-1 text-gray-200">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-1 text-gray-200">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                        {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                    </div>

                    {/* Mobile */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-1 text-gray-200">Mobile Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                {...register("mobile", { required: "Mobile is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-1 text-gray-200">Admin Role</label>
                        <div className="relative">
                            <FaIdBadge className="absolute left-3 top-3.5 text-gray-400" />
                            <select
                                {...register("role", { required: "Role is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-white [&>option]:text-black"
                            >
                                <option value="">Select Role</option>
                                {ADMIN_ROLES.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        {selectedRole && (
                            <p className="text-xs text-yellow-300 mt-1">
                                {ADMIN_ROLES.find(r => r.value === selectedRole)?.desc}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-1 text-gray-200">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-1 text-gray-200">Confirm Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (val) => {
                                        if (watch('password') != val) {
                                            return "Your passwords do no match";
                                        }
                                    }
                                })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && <span className="text-red-400 text-xs">{errors.confirmPassword.message}</span>}
                    </div>

                    {/* Submit */}
                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold rounded-lg shadow-lg shadow-yellow-600/30 transform transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Register Admin"}
                        </button>
                    </div>

                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/admin/login" className="text-yellow-400 hover:underline">Login here</Link>
                </div>
            </motion.div>
        </div>
    );
}
