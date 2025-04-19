import React, { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Logo from "../Logo/Logo";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { openSignIn } = useClerk();

  const handleAvatarClick = () => setIsDropdownOpen((prev) => !prev);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY < lastScrollY || currentY < 10);
      setLastScrollY(currentY);
    };

    const handleMouseMove = (e) => {
      if (e.clientY < 30) setShowNavbar(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed z-50 top-0 left-0 w-full p-4 shadow-md transition-all duration-500 ease-in-out transform ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        darkMode
          ? "bg-black/30 text-white"
          : "bg-white/30 text-black backdrop-blur-lg"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-[#0096FF] hover:text-blue-400 transition"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <SignedIn>
            <div ref={dropdownRef} className="relative flex items-center gap-2">
              {user?.role && (
                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                    user.role === "recruiter"
                      ? "bg-green-500 text-white"
                      : "bg-purple-500 text-white"
                  }`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              )}

              <img
                src={clerkUser?.imageUrl}
                alt="avatar"
                onClick={handleAvatarClick}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-600 object-cover"
              />

              {isDropdownOpen && (
                <div
                  className={`absolute top-full right-0 mt-2 w-56 rounded-xl shadow-xl z-50 transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-800 text-white border border-gray-700"
                      : "bg-white text-black border border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm hover:bg-blue-100 dark:hover:bg-blue-700 hover:text-blue-700 dark:hover:text-white transition rounded-t-xl"
                  >
                    <FaTachometerAlt className="text-lg text-[#0096FF]" />
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-700 dark:hover:text-white transition rounded-b-xl"
                  >
                    <FaSignOutAlt className="text-lg" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </SignedIn>

          <SignedOut>
            <button
              onClick={() => openSignIn()}
              className="text-xl underline cursor-pointer text-[#0096FF] hover:text-[#89CFF0] transition"
            >
              Sign In
            </button>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;