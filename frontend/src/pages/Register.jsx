// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000/api/auth";

import { getDashboardPath } from "../utils/roleRedirect";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("user");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // Password fields
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // General user fields
  const [ageGroup, setAgeGroup] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [travelPreference, setTravelPreference] = useState("");
  const [travelLevel, setTravelLevel] = useState("");

  // Local guide fields
  const [experienceYears, setExperienceYears] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [idProofType, setIdProofType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ⭐ Password Strength Checker
  function checkPasswordStrength(value) {
    setPassword(value);

    const regexStrong =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

    const regexMedium =
      /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/;

    if (regexStrong.test(value)) setPasswordStrength("strong");
    else if (regexMedium.test(value)) setPasswordStrength("medium");
    else setPasswordStrength("weak");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (passwordStrength === "weak") {
      setErrorMsg("Password is too weak. Add uppercase, number & symbol.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        mobile,
        role,

        ageGroup,
        state,
        city,
        travelPreference,
        travelLevel,

        experienceYears,
        expertise,
        languages,
        district,
        village,
        idProofType,
        idNumber,
        bio,
        availability,
      };

      const res = await axios.post(`${API_BASE}/register`, payload, {
        withCredentials: true,
      });

      const user = res.data.user;
      login(user);

      // Redirect based on role
      if (user.role === "user" || user.role === "local_guide") {
        navigate("/");
      } else {
        navigate(getDashboardPath(user.role));
      }

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-black relative">
      <div className="absolute inset-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1603264042765-86b4148c4b18"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">

          {/* Role Switch */}
          <div className="flex justify-between mb-6">
            <button
              onClick={() => setRole("user")}
              className={`px-4 py-2 rounded-xl ${role === "user"
                  ? "bg-emerald-500 text-black"
                  : "bg-black/30 text-white"
                }`}
            >
              Traveller
            </button>

            <button
              onClick={() => setRole("local_guide")}
              className={`px-4 py-2 rounded-xl ${role === "local_guide"
                  ? "bg-amber-400 text-black"
                  : "bg-black/30 text-white"
                }`}
            >
              Local Guide / Host
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-900/40 text-red-200 rounded-xl border border-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

            {/* COMMON FIELDS */}
            <input placeholder="Full Name" className="input" value={name}
              onChange={(e) => setName(e.target.value)} />

            <input placeholder="Email" className="input" value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <input placeholder="Mobile Number" className="input" value={mobile}
              onChange={(e) => setMobile(e.target.value)} />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => checkPasswordStrength(e.target.value)}
            />

            {/* Password Strength Indicator */}
            <p className="col-span-2 text-sm text-white">
              {password && (
                <>
                  {passwordStrength === "strong" && (
                    <span className="text-green-400">Strong Password</span>
                  )}
                  {passwordStrength === "medium" && (
                    <span className="text-yellow-300">Medium Strength</span>
                  )}
                  {passwordStrength === "weak" && (
                    <span className="text-red-400">Weak Password</span>
                  )}
                </>
              )}
            </p>

            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {/* USER FIELDS */}
            {role === "user" && (
              <>
                <select className="input" onChange={(e) => setAgeGroup(e.target.value)}>
                  <option>Age Group</option>
                  <option>18-25</option>
                  <option>26-40</option>
                  <option>40+</option>
                </select>

                <input placeholder="State" className="input"
                  onChange={(e) => setState(e.target.value)} />

                <input placeholder="City" className="input"
                  onChange={(e) => setCity(e.target.value)} />

                <select className="input" onChange={(e) => setTravelPreference(e.target.value)}>
                  <option>Travel Preference</option>
                  <option>Nature</option>
                  <option>Adventure</option>
                  <option>Wildlife</option>
                  <option>Cultural</option>
                </select>

                <select className="input" onChange={(e) => setTravelLevel(e.target.value)}>
                  <option>Travel Experience</option>
                  <option>Beginner</option>
                  <option>Moderate</option>
                  <option>Frequent Traveller</option>
                </select>
              </>
            )}

            {/* LOCAL GUIDE FIELDS */}
            {role === "local_guide" && (
              <>
                <input
                  placeholder="Experience in Years"
                  className="input"
                  type="number"
                  onChange={(e) => setExperienceYears(e.target.value)}
                />

                <input
                  placeholder="District"
                  className="input"
                  onChange={(e) => setDistrict(e.target.value)}
                />

                <input
                  placeholder="Village"
                  className="input"
                  onChange={(e) => setVillage(e.target.value)}
                />

                <input
                  placeholder="Languages Known (comma separated)"
                  className="input"
                  onChange={(e) => setLanguages(e.target.value.split(","))}
                />

                <input
                  placeholder="Area of Expertise (comma separated)"
                  className="input"
                  onChange={(e) => setExpertise(e.target.value.split(","))}
                />

                <select className="input" onChange={(e) => setAvailability(e.target.value)}>
                  <option>Availability</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>On Request</option>
                </select>

                <select className="input" onChange={(e) => setIdProofType(e.target.value)}>
                  <option>ID Proof Type</option>
                  <option>Aadhar</option>
                  <option>PAN</option>
                  <option>Voter ID</option>
                  <option>Driving License</option>
                </select>

                <input
                  placeholder="ID Number"
                  className="input"
                  onChange={(e) => setIdNumber(e.target.value)}
                />

                <textarea
                  placeholder="Short Bio / Description"
                  className="col-span-2 p-3 rounded-xl bg-black/40 border border-emerald-400 text-white"
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </>
            )}

            <button
              type="submit"
              className="col-span-2 mt-4 py-2.5 bg-gradient-to-r from-emerald-500 to-amber-400 text-black rounded-xl font-semibold"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-white text-sm">
            Already have an account?{" "}
            <Link className="text-amber-300 font-semibold underline" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
