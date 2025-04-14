import React, { useContext } from 'react';
import { FaBriefcase, FaUsers, FaGlobe } from 'react-icons/fa';
import { ThemeContext } from '../../Context/ThemeContext';

const features = [
  {
    icon: <FaBriefcase size={28} />,
    title: "Post Jobs Easily",
    desc: "Create and publish job listings in just a few clicks."
  },
  {
    icon: <FaUsers size={28} />,
    title: "Smart Matchmaking",
    desc: "Get job and candidate matches based on skills and preferences."
  },
  {
    icon: <FaGlobe size={28} />,
    title: "Global Reach",
    desc: "Connect with talent and opportunities from around the world."
  }
];

const FeatureSection = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`w-full py-16 px-4 md:px-20 transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        Platform <span className="text-[#0096FF]">Features</span>
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 shadow-xl transition-all duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="text-[#0096FF] mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="opacity-80">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;