import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext';

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div
      className={`pt-32 min-h-screen flex flex-col items-center justify-center px-4 transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-green-50 to-white text-gray-800'
        }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">
          Welcome to{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-800'}>
            Next
            <span className={darkMode ? 'text-green-400' : 'text-green-700'}>
              H
            </span>
            ire
          </span>
        </h1>

        <p className="text-lg mb-2">
          Discover your next opportunity or find the perfect candidate.
        </p>
        <p className="text-md text-gray-500">
          Simplifying the hiring process for recruiters and job seekers.
        </p>

        {!isSignedIn && (
          <div className="mt-8">
            <button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out"
            >
              Get Started
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Home