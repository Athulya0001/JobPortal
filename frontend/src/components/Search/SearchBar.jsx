import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchBar = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!title.trim() && !location.trim()) {
        toast.warning("Please enter a search")
        return;
      }
    const queryParams = new URLSearchParams();
    if (title) queryParams.append('title', title);
    if (location) queryParams.append('location', location);

    navigate(`/search?${queryParams.toString()}`);

    setTitle('');
    setLocation('');
  };

  return (
    <div
      className={`shadow-xl rounded-xl px-3 py-6 w-full max-w-xl mt-6 md:mt-10 transition duration-300 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Job Title / Skill"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${
            darkMode
              ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-[#0096FF]'
              : 'bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#0096FF]'
          }`}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className={`px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${
            darkMode
              ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-[#0096FF]'
              : 'bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#0096FF]'
          }`}
        />
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
