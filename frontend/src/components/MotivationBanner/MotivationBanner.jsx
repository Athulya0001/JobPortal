import React from "react";
import { motion } from "framer-motion";
import Team from "../../assets/motive.jpg";

const MotivationBanner = () => {
  return (
    <section className="bg-black text-white rounded-2xl p-6 md:p-12 my-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Create A Better <br /> Future For Yourself
        </h2>
        <p className="text-base md:text-lg text-gray-300 mb-6">
          Your future depends on today’s choices. Set goals, keep learning, and
          stay committed to growth for a better tomorrow.
        </p>
        <a href="#search">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
            Search Job
          </button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2"
      >
        <img
          src={Team}
          alt="Professional Team"
          className="w-full object-cover"
        />
      </motion.div>
    </section>
  );
};

export default MotivationBanner;
