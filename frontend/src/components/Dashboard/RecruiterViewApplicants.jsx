import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { ThemeContext } from "../../Context/ThemeContext";
import { setUser } from "../../Redux/Reducers/authSlice";

const RecruiterViewApplicants = () => {
  const jobsCreated = useSelector(
    (state) => state.auth.recruiterProfile?.jobsCreated
  );
  const user = useSelector((state) => state.auth.user);
  const recruiterProfile = useSelector((state) => state.auth.recruiterProfile);
  const profileComplete = useSelector((state) => state.auth.profileComplete);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [loadingStatus, setLoadingStatus] = useState({});
  const [action, setAction] = useState("");
  const dispatch = useDispatch();

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

        // const updatedJobs = jobsCreated.map((j) =>
        //   j._id === job._id ? job : j
        // );

        // dispatch(
        //   setUser({
        //     ...user,
        //     profileComplete,
        //     profile: recruiterProfile,
        //     jobsCreated: updatedJobs,
        //   })
        // );
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
      className={`flex h-full min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex-1 p-6 overflow-y-auto max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">
          Applicants for Your Jobs
        </h1>
        {jobsCreated.map((job) => (
          <div
            key={job._id}
            className={`mb-8 rounded-xl p-6 border shadow-sm ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50"
            }`}
          >
            <h2 className="text-2xl font-bold text-[#0096ff] mb-2">
              {job.title}
            </h2>
            <h3 className="text-md font-semibold mb-2">
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

            <h3 className="text-xl font-semibold mb-3">Applicants</h3>
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
                      className={`flex justify-between items-center rounded-lg p-4 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-lg">
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
                            className={`inline-block mt-2 px-3 py-1 ml-2 text-xs font-semibold rounded-full ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
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
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={closeModal}
                className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
              <iframe
                src={resumeUrl}
                title="Resume Viewer"
                className="w-full h-[85vh] border-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterViewApplicants;
