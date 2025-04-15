import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaDollarSign, FaUserTie } from 'react-icons/fa';

const JobCard = ({ jobId }) => {
  const jobs = useSelector((state) => state.jobs.jobs);
  const recruiter = useSelector((state) => state.auth.recruiterProfile);
  const job = jobs.find((job) => job._id === jobId);
  const { darkMode } = useContext(ThemeContext);

  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true }}
    >
      <div
        className={`w-full max-w-xl mx-auto rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden 
        ${darkMode ? "bg-[#1f2937] border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-900"}`}
      >
        <div className="p-6 space-y-4">
          <div>
            <h5 className="text-sm font-medium text-indigo-500 uppercase tracking-wide">
              {recruiter?.companyDetails.name}
            </h5>
            <h3 className="text-2xl font-bold mt-1 leading-snug hover:text-indigo-600 transition-colors duration-300">
              {job.title}
            </h3>
          </div>

          <p className="text-sm line-clamp-3 text-gray-500 dark:text-gray-400">{job.description}</p>

          <div>
            <p className="text-sm text-gray-400 uppercase font-medium">Skills Required</p>
            <p className="font-semibold mt-1">{job.skillsRequired.join(', ')}</p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-indigo-500" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserTie className="text-indigo-500" />
              <span>{job.numberOfVacancies} Vacancy</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-indigo-500" />
              <span>{recruiter?.companyDetails.location || 'Location N/A'}</span>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to={`/job/${job._id}`}
              className="inline-block px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 font-semibold shadow-sm"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
