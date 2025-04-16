import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../Context/ThemeContext";
import { FaMapMarkerAlt, FaDollarSign, FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { JobContext } from "../../Context/JobContext";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const recruiter = useSelector((state) => state.auth.recruiterProfile);
  const candidate = useSelector((state) => state.auth.candidateProfile);
  const { darkMode } = useContext(ThemeContext);
  const { handleToggleSave } = useContext(JobContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasApplied = job?.applicants?.includes(candidate?._id);

  const isOwnJob = recruiter?.user === user?._id;
  const isSaved = candidate?.savedJobs?.includes(job?._id);

  const fetchJob = async (jobId) => {
    if (!jobId) return;

    try {
      const res = await axios.get(`http://localhost:4000/api/job/${jobId}`);
      if (res.data.success) {
        setJob(res.data.job);
      } else {
        setError("Job not found");
      }
    } catch (err) {
      setError("Error fetching job");
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob(id);
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please log in to apply for this job.");
      navigate("/auth");
      return;
    }

    if (user?.role !== "candidate") {
      toast.error("Only candidates can apply for jobs.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/api/candidate/apply/${id}`, {
        candidateId: candidate._id,
      });

      if (response.data.success) {
        toast.success("Application submitted successfully!");
        setJob((prevJob) => ({
          ...prevJob,
          applicants: [...prevJob.applicants, user._id],
        }));
      } else {
        toast.error(response.data.message || "Failed to apply for the job.");
      }
    } catch (err) {
      toast.error("An error occurred while applying. Please try again.");
      console.error("Error applying for job:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center mt-[85px] text-red-500">{error}</p>;
  if (!job) return <p className="text-center mt-[85px] text-red-500">Job not found.</p>;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="mx-auto pt-[80px] px-6 py-5 max-w-7xl">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          {user?.role==='candidate'&&(
            <button
            onClick={() => handleToggleSave(job._id)}
            className=" text-2xl text-[#0096FF] cursor-pointer"
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2 text-[#0096ff]">{job.createdBy?.companyDetails.name}</h2>

        <div className="flex items-center gap-3 text-sm mb-4">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{job.createdBy?.companyDetails?.location || "Unknown Location"}</span>
        </div>

        <div className="flex items-center gap-3 text-sm mb-6">
          <FaDollarSign className="text-gray-500" />
          <span>{job.salary}</span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Description:</h3>
          <p className="opacity-70 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Skills Required:</h3>
          <p className="opacity-70">{job.skillsRequired.join(", ")}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Vacancies:</h3>
          <p className="opacity-70">{job.numberOfVacancies}</p>
        </div>

        <div className="flex justify-between mt-6">
          <div className="text-center">
            {user?.role === "recruiter" && isOwnJob ? (
              <button
                onClick={() => {
                  console.log("View Applicants clicked");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Applicants
              </button>
            ) : user?.role === "candidate" ? (
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`px-6 py-2 rounded transition ${hasApplied
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {hasApplied ? "Applied" : "Apply Now"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;