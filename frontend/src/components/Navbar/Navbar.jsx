import React, { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { useUser, useClerk } from "@clerk/clerk-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleAvatarClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <nav className={`fixed z-50 top-0 left-0 w-full p-4 shadow-lg ${darkMode ? "bg-green-700 text-black" : "bg-green-500 text-white"}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to='/'>
          <h1 className={`text-3xl font-bold ${darkMode ? "text-black" : "text-white"}`}>
            ne<span className="text-3xl text-green-900">X</span>tHire
          </h1>
        </Link>

        <div className="flex items-center space-x-4 relative">
          <button onClick={() => setDarkMode(!darkMode)} className={`text-xl ${darkMode ? "text-black" : "text-white"}`}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <SignedIn>
            <div ref={dropdownRef} className="relative">
              <img
                src={user?.imageUrl}
                alt="avatar"
                onClick={handleAvatarClick}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
              />

              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-50 transition-all duration-30 ${darkMode ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'} `}
                >
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm hover:bg-green-600 hover:text-white transition rounded-t-xl"
                  >
                    <FaTachometerAlt className="text-lg" />
                    Go to Dashboard
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm hover:bg-green-600 hover:text-white transition"
                  >
                    <FaUser className="text-lg" />
                    View Profile
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-700 dark:hover:text-white transition rounded-b-xl"
                  >
                    <FaSignOutAlt className="text-lg" />
                    Logout
                  </button>
                </div>
              )}

            </div>
          </SignedIn>

          <SignedOut>
            <a href='/auth' className={`text-xl underline cursor-pointer ${darkMode ? "text-black hover:text-gray-700" : "text-white hover:text-gray-100"}`}>
              Sign In
            </a>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;