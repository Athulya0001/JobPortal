import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSuitcase, FaDollarSign } from 'react-icons/fa';

const JobCard = ({ jobId }) => {
    const jobs = useSelector((state) => state.jobs.jobs);
    const recruiter = useSelector((state) => state.auth.recruiterProfile)
    const job = jobs.find((job) => job._id === jobId);
    const { darkMode } = useContext(ThemeContext);

    if (!job) return null;

    return (
        <motion.div
            style={{ willChange: "transform, opacity" }}
            initial={{ opacity: 0, translateY: 50 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            viewport={{ once: true }}
        >
            <div
                className={`w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
            >
                <div className="p-6 space-y-6">
                    <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-600">{recruiter?.companyDetails.name}</h5>
                        <h3 className="text-3xl font-semibold text-gray-800 mt-1 hover:text-green-600 transition-colors duration-300">
                            {job.title}
                        </h3>
                    </div>

                    <p className="text-gray-600 text-lg mb-6 line-clamp-4">{job.description}</p>

                    <div className="mb-6">
                        <p className="text-sm text-gray-600">Skills Required:</p>
                        <p className="font-semibold text-gray-800">{job.skillsRequired.join(', ')}</p>
                    </div>

                    <div className="flex gap-6 mb-6">
                        <div className='flex justify-center items-center'>
                            <FaDollarSign className="text-gray-500" />
                            <span>{job.salary}</span>
                        </div>
                    </div>

                    <div className="flex gap-6 mb-6">
                        <div className="flex justify-center items-center">
                            <p className="text-sm text-gray-600">Vacancies:</p>
                            <p className="font-semibold text-gray-800">{job.numberOfVacancies}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <span>{recruiter?.companyDetails.location}</span>
                    </div>

                    <div className="text-center mt-4">
                        <Link
                            to={`/job/${job._id}`}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
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