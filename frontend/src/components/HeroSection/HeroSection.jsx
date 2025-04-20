import React, { useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import SearchBar from '../Search/SearchBar';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`mt-20 md:mt-28 lg:mt-32 xl:mt-40 pt-6 h-auto flex flex-col items-center px-4 transition duration-300 ${
        darkMode ? 'text-white' : 'text-black'
      }`}
    >
      <SearchBar />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-3xl mt-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0096FF] mb-4">
          Welcome to{' '}
          <span>
            ne
            <span className={`${darkMode ? 'text-white' : 'text-black'} drop-shadow-2xl`}>
              X
            </span>
            tHire
          </span>
        </h1>

        <p className="text-lg sm:text-xl mb-4">
          Everything you need to hire or get hired — all in one place.
        </p>
        <p className="text-md sm:text-lg opacity-55">
          Discover your next opportunity or find the perfect candidate.
        </p>
      </motion.div>
    </div>
  );
};

export default HeroSection;
