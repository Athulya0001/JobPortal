import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { JobContext } from '../../Context/JobContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const LatestJobs = () => {
    const jobs = useSelector(state => state.jobs.allJobs);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { fetchAllJobs,handleToggleSave } = useContext(JobContext)
    const candidate = useSelector(state => state.auth.candidateProfile);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        fetchAllJobs();
    }, [fetchAllJobs]);

    const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <section className={`py-10 px-4 transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#0096FF]">Latest Jobs</h2>

                {jobs.length === 0 ? (
                    <p className="text-center text-gray-400">No jobs available right now.</p>
                ) : (
                    <div className="space-y-4">
                        {sortedJobs.slice(0, 5).map((job) => {
                            const isSaved = candidate?.savedJobs?.includes(job._id)

                            return (
                                <div
                                    key={job._id}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                                >
                                    {user?.role === 'candidate' && (
                                        <button
                                            onClick={() => handleToggleSave(job._id)}
                                            className="absolute top-4 right-4 text-xl text-[#0096FF]"
                                        >
                                            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                        </button>
                                    )}

                                    <div
                                        onClick={() => navigate(`/job/${job._id}`)}
                                        className="flex items-start md:items-center gap-4 w-full"
                                    >
                                        <img
                                            src={job.thumbnail}
                                            alt="company"
                                            className="w-16 h-16 rounded-md object-cover border border-gray-300 dark:border-gray-600"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-semibold text-[#0096FF]">{job.title}</h3>
                                            <p className="text-sm mt-1 max-w-md opacity-80 line-clamp-2">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {job.skillsRequired?.map((skill, index) => (
                                                    <span key={index} className="text-xs px-2 py-1 bg-[#0096FF]/10 text-[#0096FF] rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start md:items-end text-sm mt-2 md:mt-0 whitespace-nowrap">
                                        <p className="opacity-80">Vacancies: {job.numberOfVacancies}</p>
                                        <p className="opacity-80">Salary: ₹{job.salary}</p>
                                        <p className="opacity-60 mt-1">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestJobs