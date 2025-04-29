import React, { useContext} from 'react';
import { useSelector} from 'react-redux';
import { ThemeContext } from '../../Context/ThemeContext';
import JobCard from '../JobCard/JobCard';
import Loading from '../Loading/Loading'

const RecruiterViewJobs = () => {
  const jobs = useSelector((state)=>state.auth.recruiterProfile.jobsCreated)

  const { darkMode } = useContext(ThemeContext);

  if (!jobs) {
    return <div>
      <Loading />
    </div>
  }

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`flex-1 p-6 overflow-y-auto`}>
        <h2 className="text-3xl font-semibold mb-6">Your Posted Jobs</h2>

        {jobs.length > 0 ? (
          <div className="flex flex-wrap gap-6">
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