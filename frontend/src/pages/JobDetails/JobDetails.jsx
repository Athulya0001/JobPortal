import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../Context/ThemeContext';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const JobDetails = () => {
    const { id } = useParams();
    const jobs = useSelector((state) => state.jobs.jobs);
    const role = useSelector((state) => state.auth.user.role);
    const job = jobs.find((job) => job._id === id);
    const { darkMode } = useContext(ThemeContext);

    if (!job) {
        return <p className="text-center mt-[85px] text-red-500">Job not found.</p>;
    }

    return (
        <div className={`max-w-5xl mx-auto mt-[85px] px-6 py-5 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <h2 className="text-xl font-semibold mb-2 text-green-600">{job.createdBy.name}</h2>

            <div className="flex items-center gap-3 text-sm mb-4">
                <FaMapMarkerAlt className="text-gray-500" />
                <span>{job.createdBy?.companyDetails?.location || 'Unknown Location'}</span>
            </div>

            <div className="flex items-center gap-3 text-sm mb-6">
                <FaDollarSign className="text-gray-500" />
                <span>{job.salary}</span>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Description:</h3>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Skills Required:</h3>
                <p className="text-gray-600">{job.skillsRequired.join(', ')}</p>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Vacancies:</h3>
                <p className="text-gray-600">{job.numberOfVacancies}</p>
            </div>

            <div className="text-center mt-6">
                {role === 'recruiter' ? (
                    <button
                        onClick={() => {
                            console.log('View Applicants clicked');
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        View Applicants
                    </button>
                ) : (
                    <button
                        onClick={() => window.scrollTo(0, 0)}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Apply Now
                    </button>
                )}
            </div>

        </div>
    );
};

export default JobDetails;