import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../Context/ThemeContext";
import JobCard from "../JobCard/JobCard";

const CandidateAppliedJobs = () => {
  const candidateProfile = useSelector((state) => state.auth.candidateProfile);
  const { darkMode } = useContext(ThemeContext);
  const jobs = useSelector((state) => state.jobs.allJobs || []);

  const appliedJobsId = candidateProfile?.appliedJobs || [];
  const appliedJobs = jobs.filter((job) => appliedJobsId.includes(job._id));

  return (
    <section
      className={`py-10 px-4 transition duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096ff]">
          Applied Jobs
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {appliedJobs.length > 0 ? (
            appliedJobs.map((job) => (
              <JobCard key={job._id} job={job} darkMode={darkMode} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              You haven't applied to any jobs yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CandidateAppliedJobs;
