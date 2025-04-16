import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext';
import JobCard from '../JobCard/JobCard';
import Loading from '../Loading/Loading'

const RecruiterViewJobs = () => {
  const allJobs = useSelector((state) => state.jobs.allJobs || []);
  const recruiterId = useSelector((state) => state.auth.recruiterProfile?._id);

  const jobs = allJobs.filter((job) => recruiterId === job.createdBy._id);

  const { darkMode } = useContext(ThemeContext);

  if (!jobs) {
    return <div>
      <Loading />
    </div>
  }

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <h2 className="text-3xl font-semibold mb-6">Your Posted Jobs</h2>

        {jobs.length > 0 ? (
          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No jobs posted yet.</p>
        )}
      </div>

    </div>
  );

};

export default RecruiterViewJobs;