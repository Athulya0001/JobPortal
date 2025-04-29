import React, { useContext } from "react";
import { useSelector } from "react-redux";
import JobCard from '../JobCard/JobCard'
import { ThemeContext } from "../../Context/ThemeContext";

const CandidateSavedJobs = () => {
  const savedJobIds = useSelector(
    (state) => state.auth.candidateProfile?.savedJobs || []
  );
  const allJobs = useSelector((state) => state.jobs.allJobs || []);
  const {darkMode} = useContext(ThemeContext)

  const savedJobs = allJobs.filter((job) => savedJobIds.includes(job._id));

  return (
    <section className={`py-10 px-4 transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096ff]">Saved Jobs</h2>
        <div className="flex flex-wrap gap-6">
          {savedJobs.length > 0 ? (
            savedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <p className="text-center text-gray-500">No saved jobs yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CandidateSavedJobs;