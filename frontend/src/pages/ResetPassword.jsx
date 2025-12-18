// frontend/src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/reset-password`, {
        token,
        password,
      });
      setMessage(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to reset password. Token may be expired."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1603264045664-3f4f76c9e3b6?auto=format&fit=crop&w=1600&q=80"
          alt="Jharkhand sunrise"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-emerald-900/40 to-black" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black/60 border border-emerald-500/40 rounded-3xl p-7 shadow-xl backdrop-blur">
          <h1 className="text-2xl font-bold text-white">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-emerald-100/80">
            Choose a strong password to secure your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-emerald-100 text-xs mb-1">
                New password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-emerald-100 text-xs mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-emerald-500/40 text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 shadow disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-xs text-emerald-100/90">{message}</p>
          )}

          <p className="mt-5 text-xs text-emerald-100 text-center">
            Go back to{" "}
            <Link
              to="/login"
              className="text-amber-300 underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
