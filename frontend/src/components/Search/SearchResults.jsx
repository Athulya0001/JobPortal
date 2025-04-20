import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";

const SearchResults = () => {
  const { darkMode } = useContext(ThemeContext);
  const jobs = useSelector((state) => state.jobs.allJobs);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title")?.toLowerCase() || "";
  const loc = queryParams.get("location")?.toLowerCase() || "";

  const filteredJobs = jobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();
    const skills = job.skillsRequired.join(" ").toLowerCase();
    const jobLocation =
      job.createdBy?.companyDetails?.location?.toLowerCase() || "";

    const titleMatch =
      title === "" || jobTitle.includes(title) || skills.includes(title);
    const locationMatch = loc === "" || jobLocation.includes(loc);

    return titleMatch && locationMatch;
  });

  return (
    <div
      className={`min-h-screen p-6 ${darkMode ? "text-white" : "text-black"} pt-[72px]`}
    >
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500">No jobs match your search criteria.</p>
      ) : (
        <ul className="space-y-6 max-w-4xl mx-auto">
          {filteredJobs.map((job) => (
            <li
              key={job._id}
              className={`p-4 rounded-lg shadow border hover:cursor-pointer transition ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              <Link to={`/job/${job._id}`}>
                <h3 className="text-xl font-bold text-[#0096FF]">
                  {job.title}
                </h3>
                <p className="text-sm">
                  <strong>Location:</strong>{" "}
                  {job.createdBy?.companyDetails?.location || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Skills:</strong> {job.skillsRequired.join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
