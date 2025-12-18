import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useThemeStore } from "../../context/themeStore";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/roleRedirect";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Navbar User:", user);

  const navItems = [
    { title: "Home", link: "/" },
    { title: "Explore", link: "/explore" },
    { title: "Packages", link: "/packages" },
    { title: "Hotels", link: "/hotels" },
    { title: "Culture", link: "/culture" },
    { title: "About Jharkhand", link: "/about" },
    { title: "Contact", link: "/contact" },
  ];

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Avatar image
  const avatar = user?.photo
    ? user.photo
    : `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=2E7D32&color=fff`;

  const isAdmin = user && user.role !== "user" && user.role !== "local_guide";
  console.log("Is Admin:", isAdmin);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-lg"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to={isAdmin ? getDashboardPath(user.role) : "/"}
            className="text-2xl font-bold text-primary dark:text-white"
          >
            JharkhandTour
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {!isAdmin && navItems.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="relative text-gray-700 dark:text-gray-200 text-sm font-medium hover:text-primary transition group"
              >
                {item.title}
                <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {isAdmin && (
              <Link
                to={getDashboardPath(user.role)}
                className="relative text-gray-700 dark:text-gray-200 text-sm font-medium hover:text-primary transition group"
              >
                Dashboard
                <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "light" ? (
                <FaMoon className="text-xl text-gray-600" />
              ) : (
                <FaSun className="text-xl text-yellow-400" />
              )}
            </button>

            {/* --- USER PROFILE SYSTEM --- */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  title="User Login"
                >
                  Login
                </Link>

                <Link
                  to="/admin/login"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Admin Login"
                >
                  <FaUserShield className="text-xl text-gray-600 dark:text-gray-300" />
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition"
                >
                  <img
                    src={avatar}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                  <IoIosArrowDown className="text-gray-700 dark:text-gray-200" />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50">
                    {!isAdmin && (
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpenMenu(false)}
                      >
                        View Profile
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to={getDashboardPath(user.role)}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpenMenu(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        logout();
                        setOpenMenu(false);
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-gray-700 dark:text-gray-200"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg transform transition-all duration-300 z-50 ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">Menu</h3>
          <button onClick={() => setMobileOpen(false)}>
            <FaTimes className="text-2xl dark:text-white" />
          </button>
        </div>

        <div className="flex flex-col p-5 space-y-4">
          {!isAdmin && navItems.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 dark:text-gray-300 text-lg"
            >
              {item.title}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to={getDashboardPath(user.role)}
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 dark:text-gray-300 text-lg"
            >
              Dashboard
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
            Toggle Theme
          </button>

          {/* Mobile login/view profile */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary text-white"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/admin/login"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaUserShield /> Admin Panel
              </Link>
            </>
          ) : (
            <>
              {!isAdmin && (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  My Profile
                </Link>
              )}

              {isAdmin && (
                <Link
                  to={getDashboardPath(user.role)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate('/');
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-red-600 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
