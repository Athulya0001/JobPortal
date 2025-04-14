import React, { useState, useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

const SearchBar = ({ onSearch }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const { darkMode } = useContext(ThemeContext);

  const handleSearch = () => {
    const filters = { title, location };
    onSearch(filters);
  };

  return (
    <div
      className={`shadow-xl rounded-xl px-3 py-6 w-full max-w-xl mt-10 transition duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Job Title */}
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`px-5 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-[#0096FF]"
              : "bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#0096FF]"
          }`}
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`px-5 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-[#0096FF]"
              : "bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#0096FF]"
          }`}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-[#0096FF] hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-2 w-full transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
