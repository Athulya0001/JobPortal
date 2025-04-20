import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { JobContext } from "../../Context/JobContext";
import { ThemeContext } from "../../Context/ThemeContext";

const RecommendedJobs = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { handleToggleSave } = useContext(JobContext);

  const candidate = useSelector((state) => state.auth.candidateProfile);
  const allJobs = useSelector((state) => state.jobs.allJobs);
  const user = useSelector((state) => state.auth.user);

  if (!candidate || user?.role !== "candidate") return null;

  const candidateSkills =
    candidate.skills?.map((skill) => skill.toLowerCase()) || [];

  const recommendedJobs = allJobs.filter((job) =>
    job.skillsRequired?.some((skill) =>
      candidateSkills.includes(skill.toLowerCase())
    )
  );

  return (
    <section
      className={`py-10 px-4 transition duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096FF]">
          Recommended Jobs for You
        </h2>

        {recommendedJobs.length === 0 ? (
          <p className="text-center text-gray-400">
            No recommended jobs based on your skills yet.
          </p>
        ) : (
          <div className="space-y-6">
            {recommendedJobs.slice(0, 4).map((job) => {
              const isSaved = candidate?.savedJobs?.includes(job._id);

              return (
                <div
                  key={job._id}
                  className={`relative flex flex-col md:flex-row md:items-start gap-4 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-transparent hover:border-[#007ACC] ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  }`}
                  onClick={() => navigate(`/job/${job._id}`)}
                >
                  <div className="flex flex-row items-start gap-4 w-full">
                    <img
                      src={job.thumbnail}
                      alt="company"
                      className="w-16 h-16 rounded-md object-cover border border-gray-300 dark:border-gray-600"
                    />

                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-start w-full">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#0096FF]">
                          {job.title}
                        </h3>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(job._id);
                          }}
                          className="text-xl text-[#0096FF] hover:text-[#007ACC]"
                        >
                          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                      </div>

                      <p className="text-sm mt-1 max-w-xl opacity-80 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skillsRequired?.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-[#0096FF]/10 text-[#0096FF] rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between md:flex-col md:justify-center gap-1 md:items-end text-sm mt-2 md:mt-0 whitespace-nowrap">
                    <p className="opacity-80">
                      Vacancies: {job.numberOfVacancies}
                    </p>
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

export default RecommendedJobs;
