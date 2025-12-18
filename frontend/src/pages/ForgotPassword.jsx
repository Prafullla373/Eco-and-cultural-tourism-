// frontend/src/pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setResetUrl("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/forgot-password`, { email });
      setMessage(res.data.message || "If email exists, reset link sent.");
      if (res.data.resetUrl) setResetUrl(res.data.resetUrl);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1603264044046-3f62976a809c?auto=format&fit=crop&w=1600&q=80"
          alt="Jharkhand landscape"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-emerald-900/40 to-black/80" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/50 border border-emerald-500/40 rounded-3xl p-7 shadow-xl backdrop-blur">
          <h1 className="text-2xl font-bold text-white">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-emerald-100/80">
            Enter your registered email. If it exists, a reset link will be
            generated.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-emerald-100 text-xs mb-1">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 shadow disabled:opacity-60"
            >
              {loading ? "Processing..." : "Send reset link"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-xs text-emerald-100/90">{message}</p>
          )}

          {resetUrl && (
            <p className="mt-2 text-[11px] text-amber-200 break-all">
              Dev reset link (copy & open): <br />
              {resetUrl}
            </p>
          )}

          <p className="mt-5 text-xs text-emerald-100 text-center">
            Remembered?{" "}
            <Link
              to="/login"
              className="text-amber-300 underline underline-offset-4"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
