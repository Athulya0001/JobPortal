import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import PDFViewer from "../PDFViewer/PDFViewer";
import { AiOutlineClose } from "react-icons/ai";

const RecruiterViewApplicants = () => {
  const jobsCreated = useSelector(
    (state) => state.auth.recruiterProfile?.jobsCreated
  );
  const user = useSelector((state) => state.auth.user);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [loadingStatus, setLoadingStatus] = useState({});
  const [action, setAction] = useState("");
  const dispatch = useDispatch();
  const { fetchUserFromBackend } = useContext(UserContext);

  const openResumeModal = (url) => {
    setResumeUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setResumeUrl(null);
    setIsModalOpen(false);
  };

  const handleAction = async (jobId, applicantId, actionType) => {
    const key = `${jobId}-${applicantId}-${actionType}`;
    setAction(actionType);
    setLoadingStatus((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await axios.post(
        `http://localhost:4000/api/recruiter/update-candidate-status/${jobId}`,
        { candidateId: applicantId, action: actionType },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { isFilled, job } = response.data;

        if (isFilled) {
          toast.success("Candidate selected successfully. Job is now filled!");
        } else {
          toast.success(`Candidate ${actionType}ed successfully.`);
        }
        await fetchUserFromBackend();
      }
    } catch (error) {
      toast.error(`Failed to ${actionType} candidate.`);
      console.error(error);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [key]: false }));
    }
  };

  if (!jobsCreated || jobsCreated.length === 0) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <p className="text-xl font-medium">You haven't posted any jobs yet.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
          Applicants for Your Jobs
        </h1>

        {jobsCreated.map((job) => (
          <div
            key={job._id}
            className={`mb-6 sm:mb-8 rounded-xl p-4 sm:p-6 border shadow-sm ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50"
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#0096ff] mb-2">
              {job.title}
            </h2>
            <h3 className="text-sm sm:text-md font-semibold mb-2">
              Vacancies: {job.numberOfVacancies}
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-[#0096ff]/20 text-[#0096ff] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              Applicants
            </h3>
            {job.applicants?.length === 0 ? (
              <p className="text-gray-500">No applicants yet.</p>
            ) : (
              <div className="space-y-4">
                {job.applicants.map((applicant) => {
                  const isShortlisted = job.shortlisted?.some(
                    (c) =>
                      c?._id &&
                      applicant?._id &&
                      c._id.toString() === applicant._id.toString()
                  );
                  const isSelected = job.selected?.some(
                    (c) =>
                      c?._id &&
                      applicant?._id &&
                      c._id.toString() === applicant._id.toString()
                  );

                  let statusText = "";
                  let statusColor = "";

                  if (isSelected) {
                    statusText = "Selected";
                    statusColor = "bg-green-100 text-green-700";
                  } else if (isShortlisted) {
                    statusText = "Shortlisted";
                    statusColor = "bg-yellow-100 text-yellow-800";
                  }

                  return (
                    <div
                      key={applicant?._id}
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-lg p-4 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-base sm:text-lg">
                          {applicant?.user?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {applicant?.user?.email || "No Email"}
                        </p>
                        <button
                          onClick={() => openResumeModal(applicant?.resume)}
                          className="mt-1 text-sm text-[#0096ff] underline hover:text-[#007acc] transition"
                        >
                          View Resume
                        </button>

                        {statusText && (
                          <span
                            className={`inline-block mt-2 px-3 py-1 ml-4 text-xs font-semibold rounded-full ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 sm:justify-end">
                        {!isShortlisted && !isSelected && !job.isFilled && (
                          <button
                            onClick={() =>
                              handleAction(job._id, applicant._id, "shortlist")
                            }
                            className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                            disabled={
                              loadingStatus[
                                `${job._id}-${applicant._id}-shortlist`
                              ]
                            }
                          >
                            {loadingStatus[
                              `${job._id}-${applicant._id}-shortlist`
                            ]
                              ? "Shortlisting..."
                              : "Shortlist"}
                          </button>
                        )}

                        {isShortlisted && !isSelected && !job.isFilled && (
                          <button
                            onClick={() =>
                              handleAction(job._id, applicant._id, "select")
                            }
                            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                            disabled={
                              loadingStatus[
                                `${job._id}-${applicant._id}-select`
                              ]
                            }
                          >
                            {loadingStatus[`${job._id}-${applicant._id}-select`]
                              ? "Selecting..."
                              : "Select"}
                          </button>
                        )}

                        {isSelected && (
                          <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-md cursor-not-allowed">
                            Selected
                          </button>
                        )}

                        {job.isFilled && (
                          <div className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-md inline-block">
                            Job Filled
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-2">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden py-3 px-4">
              <button
                onClick={closeModal}
                className="absolute top-15 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500 font-bold text-2xl z-10"
              >
                <AiOutlineClose />
              </button>

              <PDFViewer fileUrl={resumeUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterViewApplicants;
