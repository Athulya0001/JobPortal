import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { JobContext } from '../../Context/JobContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const LatestJobs = () => {
    const jobs = useSelector(state => state.jobs.allJobs);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { fetchAllJobs, handleToggleSave } = useContext(JobContext)
    const candidate = useSelector(state => state.auth.candidateProfile);
    const recruiter = useSelector(state => state.auth.recruiterProfile); 
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        fetchAllJobs();
    }, [fetchAllJobs]);

    const filteredJobs = user?.role === 'recruiter'
        ? jobs.filter(job => !recruiter?.createdJobs?.includes(job._id))
        : jobs;

    const sortedJobs = [...filteredJobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (
        <section className={`py-10 px-4 transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#0096FF]">Latest Jobs</h2>

                {jobs.length === 0 ? (
                    <p className="text-center text-gray-400">No jobs available right now.</p>
                ) : (
                    <div className="space-y-4">
                        {sortedJobs.slice(0, 4).map((job) => {
                            const isSaved = candidate?.savedJobs?.includes(job._id);
                            const isRecent = Date.now() - new Date(job.createdAt).getTime() < 60 * 60 * 1000;

                            return (
                                <div
                                    key={job._id}
                                    className={`relative flex flex-col gap-4 p-5 px-15 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                                >
                                    <span className={`absolute top-6 left-4 text-xs px-2 py-1 rounded-md font-medium  ${isRecent ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-[#0096ff]'}`}>
                                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                    </span>

                                    <div
                                        onClick={() => navigate(`/job/${job._id}`)}
                                        className="flex items-start md:items-center gap-4 w-full mt-6"
                                    >
                                        <img
                                            src={job.thumbnail}
                                            alt="company"
                                            className="w-16 h-16 rounded-md object-cover border border-gray-300 dark:border-gray-600"
                                        />
                                        <div className="flex flex-col w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h3 className="text-xl font-semibold text-[#0096FF]">{job.title}</h3>

                                                {user?.role === 'candidate' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleSave(job._id);
                                                        }}
                                                        className="text-xl text-[#0096FF]"
                                                    >
                                                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                                    </button>
                                                )}
                                            </div>

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