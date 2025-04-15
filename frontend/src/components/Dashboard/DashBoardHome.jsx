import { useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../Context/ThemeContext";

const DashboardHome = () => {
    const recruiter = useSelector((state) => state.auth.recruiterProfile);
    const candidate = useSelector((state) => state.auth.candidateProfile);
    const user = useSelector((state) => state.auth.user);
    const { darkMode } = useContext(ThemeContext);
  
    const isRecruiter = user?.role === "recruiter";
    const name = user?.name || user?.email;
  
    return (
      <div className={`space-y-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <div className={`${darkMode ? "bg-[#041827] text-[#0096FF]" : "bg-[#f3faff] text-[#0096FF]"} rounded-2xl p-6 shadow-md`}>
          <h1 className="text-3xl font-semibold">Welcome, {name}</h1>
          <p className="mt-2 text-lg">
            {isRecruiter
              ? `You're managing hiring as ${recruiter?.position} at ${recruiter?.companyDetails?.name}.`
              : "Let's find your next career opportunity today!"}
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isRecruiter ? (
            <>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
                <h2 className="text-xl font-bold mb-2">Jobs Posted</h2>
                <p className="text-3xl font-semibold text-[#0096FF]">{recruiter?.createdJobs?.length || 0}</p>
              </div>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
                <h2 className="text-xl font-bold mb-2">Company Details</h2>
                <p className="text-lg font-medium">{recruiter?.companyDetails?.name || "N/A"}</p>
                <p className="text-sm italic">{recruiter?.companyDetails?.location || ""}</p>
                {recruiter?.companyDetails?.website && (
                  <p className="text-sm mt-1">
                    Website: <a href={recruiter.companyDetails.website} className="text-blue-400 underline" target="_blank" rel="noreferrer">{recruiter.companyDetails.website}</a>
                  </p>
                )}
                {recruiter?.companyDetails?.description && (
                  <p className="text-sm mt-1">{recruiter.companyDetails.description}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
                <h2 className="text-xl font-bold mb-2">Jobs Applied</h2>
                <p className="text-3xl font-semibold text-[#0096FF]">{candidate?.appliedJobs?.length || 0}</p>
              </div>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
                <h2 className="text-xl font-bold mb-2">Saved / Shortlisted / Selected</h2>
                <p>Saved: {candidate?.savedJobs?.length || 0}</p>
                <p>Shortlisted: {candidate?.shortlistedJobs?.length || 0}</p>
                <p>Selected: {candidate?.selectedJobs?.length || 0}</p>
              </div>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
                <h2 className="text-xl font-bold mb-2">Resume & Skills</h2>
                <p><span className="font-medium">Resume:</span> {candidate?.resume ? candidate.resume.split('/').pop() : "Not uploaded"}</p>
                <p><span className="font-medium">Skills:</span> {candidate?.skills?.length ? candidate.skills.join(", ") : "No skills added"}</p>
              </div>
            </>
          )}
        </div>
  
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <h2 className="text-xl font-semibold mb-4">Suggestions for You</h2>
          <ul className={`list-disc list-inside space-y-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {isRecruiter ? (
              <>
                <li>Post more jobs to attract candidates.</li>
                <li>Track applicant status via View Jobs.</li>
                {!recruiter?.profileComplete && <li>Complete your profile for better visibility.</li>}
              </>
            ) : (
              <>
                <li>Apply to jobs matching your skills.</li>
                <li>Save jobs to apply later.</li>
                {!candidate?.profileComplete && <li>Complete your profile and upload your resume.</li>}
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };
  

export default DashboardHome;