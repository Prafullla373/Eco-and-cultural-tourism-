// frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000/api/auth";

import { getDashboardPath } from "../utils/roleRedirect";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/login`,
        { email, password },
        { withCredentials: true }
      );
      const user = res.data.user;
      login(user);

      // Redirect based on role
      if (user.role === "user" || user.role === "local_guide") {
        navigate("/");
      } else {
        navigate(getDashboardPath(user.role));
      }

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1603264046146-9fa26af39917?auto=format&fit=crop&w=1600&q=80"
          alt="Jharkhand forest"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Subtle tribal pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(245,158,11,0.25),_transparent_55%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl p-8">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              Jharkhand Eco & Cultural Tourism
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Welcome back
            </h1>
            <p className="text-sm text-emerald-100/80 mt-1">
              Login to explore stays, culture, wildlife & local experiences.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 text-sm text-red-200 bg-red-900/40 border border-red-500/50 px-3 py-2 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-100 text-xs mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-emerald-100 text-xs mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-100">
              <span />
              <Link
                to="/forgot-password"
                className="hover:text-amber-300 underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 text-black font-semibold text-sm shadow-lg hover:shadow-xl hover:from-emerald-400 hover:to-amber-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-emerald-100">
            New here?{" "}
            <Link
              to="/register"
              className="text-amber-300 font-semibold underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-4 text-[10px] text-center text-emerald-100/70">
          Powered by Jharkhand Tourism – promoting eco, culture & community
          stays.
        </p>
      </div>
    </div>
  );
}
