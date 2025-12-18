import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserShield, FaLock, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { getDashboardPath } from "../../utils/roleRedirect";

export default function AdminLogin() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user?.role && Object.keys(user).length > 0) {
            const redirectPath = getDashboardPath(user.role);
            console.log("User detected, redirecting to:", redirectPath);
            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", data, {
                withCredentials: true,
            });

            const userData = res.data.user;
            if (userData.role === "user") {
                toast.error("Access Denied: Admins only");
                setLoading(false);
                return;
            }

            console.log("Login successful, updating context:", userData);
            login(userData);
            toast.success(`Welcome back, ${userData.name}`);
            // Navigation handled by useEffect

        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl text-white"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="p-4 bg-green-600/80 rounded-full mb-4 shadow-lg shadow-green-500/30">
                        <FaUserShield size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-center font-playfair">Admin Portal</h2>
                    <p className="text-gray-300 text-sm mt-1">Jharkhand Eco Cultural Tourism</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                                placeholder="admin@jharkhandtourism.com"
                            />
                        </div>
                        {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>}
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg shadow-lg shadow-green-600/30 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Authenticating..." : "Login to Dashboard"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p className="mb-2">Restricted Access • Authorized Personnel Only</p>
                    <p>
                        Don't have an account?{" "}
                        <Link to="/admin/register" className="text-green-400 hover:text-green-300 font-semibold hover:underline">
                            Create New Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
