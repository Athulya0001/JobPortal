import React, { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { JobContext } from "../../Context/JobContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaUserTie,
  FaMapMarkerAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const JobCard = ({ job }) => {
  const { deleteJob } = useContext(JobContext);
  const { darkMode } = useContext(ThemeContext);
  const role = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();

  if (!job) return null;

  const onDelete = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Confirm delete?</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                deleteJob(job._id);
                closeToast();
              }}
              className="text-red-500 hover:underline"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false } // keep it open until user interacts
    );
  };

  const onEdit = () => {
    navigate(`/update-job/${job._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
    >
      <div
        className={`w-80 h-[350px] rounded-2xl border shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden flex flex-col justify-between
    ${
      darkMode
        ? "bg-[#1f2937] border-gray-700 text-gray-200"
        : "bg-white border-gray-200 text-gray-900"
    }`}
      >
        <div className="p-6 space-y-4 flex-grow">
          <div>
            <h5 className="text-sm font-medium text-[#0096ff] uppercase tracking-wide">
              {job?.createdBy?.companyDetails?.name}
            </h5>
            <h3 className="text-2xl font-bold mt-1 hover:text-[#007acc] truncate transition-colors duration-300">
              {job.title}
            </h3>
          </div>

          <p className="text-sm line-clamp-3 text-gray-500 dark:text-gray-400">
            {job.description}
          </p>

          <div>
            <p className="text-sm text-gray-400 uppercase font-medium">
              Skills Required
            </p>
            <p className="font-semibold mt-1 truncate">
              {job.skillsRequired.join(", ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-[#0096ff]" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserTie className="text-[#0096ff]" />
              <span>{job.numberOfVacancies} Vacancy</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#0096ff]" />
              <span>{job?.createdBy?.companyDetails?.location || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex justify-between items-center">
          <Link
            to={`/job/${job._id}`}
            className="inline-block px-4 py-2 rounded-full bg-[#0096ff] text-white hover:bg-[#007acc] text-sm font-semibold shadow-sm"
          >
            View
          </Link>

          {role === "recruiter" && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition"
                title="Edit Job"
              >
                <FaEdit />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
                title="Delete Job"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
