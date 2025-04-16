import React from "react";
import { useSelector } from "react-redux";
import JobCard from '../JobCard/JobCard'

const CandidateSavedJobs = () => {
  const savedJobIds = useSelector(
    (state) => state.auth.candidateProfile?.savedJobs || []
  );
  const allJobs = useSelector((state) => state.jobs.allJobs || []);

  const savedJobs = allJobs.filter((job) => savedJobIds.includes(job._id));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Saved Jobs</h2>
      <div className="flex flex-col gap-6">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))
        ) : (
          <p className="text-center text-gray-500">No saved jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateSavedJobs;