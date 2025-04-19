import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading";

const CandidateViewJobStatus = () => {
  const candidateProfile = useSelector((state) => state.auth.candidateProfile);
  const allJobs = useSelector((state) => state.jobs.allJobs);

  if (!candidateProfile || !allJobs) {
    return <div><Loading/></div>;
  }

  const getStatus = (jobId) => {
    if (candidateProfile.selectedJobs?.includes(jobId)) return "selected";
    if (candidateProfile.shortlistedJobs?.includes(jobId)) return "shortlisted";
    if (candidateProfile.appliedJobs?.includes(jobId)) return "applied";
    return null;
  };

  const appliedJobIds = candidateProfile.appliedJobs || [];
  const appliedJobs = allJobs.filter((job) => appliedJobIds.includes(job._id));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Job Applications</h2>

      {appliedJobs.length === 0 ? (
        <p className="text-gray-500">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-6">
          {appliedJobs.map((job) => {
            const status = getStatus(job._id);

            return (
              <div
                key={job._id}
                className="border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Link to={`/job/${job._id}`}>
                      <h3 className="text-xl font-semibold text-[#0096FF] hover:underline">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      status === "selected"
                        ? "bg-green-100 text-green-700"
                        : status === "shortlisted"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateViewJobStatus;
