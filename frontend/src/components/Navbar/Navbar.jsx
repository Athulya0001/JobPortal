import React, { useState, useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {Link} from 'react-router-dom'


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { isSignedIn, user } = useUser();


  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed z-50 top-0 left-0 w-full p-4 shadow-lg ${darkMode ? "bg-green-700 text-black" : "bg-green-500 text-white"}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to='/'>
        <h1 className={`text-3xl font-bold ${darkMode? "text-black": "text-white"}`}>
          ne<span className="text-3xl text-green-900">X</span>tHire
        </h1>
        </Link>

        <div className="flex items-center space-x-4">
          <button onClick={() => setDarkMode(!darkMode)} className={`text-xl ${darkMode? "text-black": "text-white"}`}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          

      {isSignedIn ? (<SignedIn>
        <div>
          <UserButton />
        </div>
      </SignedIn>):(<a href='/auth' className={`text-xl underline cursor-pointer ${darkMode? "text-black hover:text-gray-700": "text-white hover:text-gray-100"}`}>
            Sign In
          </a>)}

          {/* <button onClick={toggleMenu} className="md:hidden text-xl text-white focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;