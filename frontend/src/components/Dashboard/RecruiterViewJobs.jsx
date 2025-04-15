import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext';
import JobCard from '../JobCard/JobCard';

const RecruiterViewJobs = () => {
  const jobs = useSelector((state) => state.jobs.jobs || []);
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <h2 className="text-3xl font-semibold mb-6">Your Posted Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job._id} jobId={job._id} darkMode={darkMode} />
            ))
          ) : (
            <p className="text-center text-gray-500">No jobs posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterViewJobs;