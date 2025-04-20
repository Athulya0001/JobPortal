import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { setUser } from "./Redux/Reducers/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import RoleSelection from "./components/RoleSelection/RoleSelection";
import SetProfile from "./components/SetProfile/SetProfile";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import RecruiterAddJob from "./components/Dashboard/RecruiterAddJob";
import RecruiterViewJobs from "./components/Dashboard/RecruiterViewJobs";
import CandidateAppliedJobs from "./components/Dashboard/CandidateAppliedJobs";
import CandidateSavedJobs from "./components/Dashboard/CandidateSavedJobs";
import JobDetails from "./pages/JobDetails/JobDetails";
import { ThemeContext } from "./Context/ThemeContext";
import InitUser from './utils/InitUser';
import SigninWarn from "./components/SigninWarn/SIgninWarn";
import DashboardHome from "./components/Dashboard/DashBoardHome";
import Loading from "./components/Loading/Loading";
import MotivationBanner from "./components/MotivationBanner/MotivationBanner";
import RecruiterViewApplicants from "./components/Dashboard/RecruiterViewApplicants";
import CandidateViewJobStatus from "./components/Dashboard/CandidateViewJobStatus";
import Footer from "./components/Footer/Footer";
import SearchResults from "./components/Search/SearchResults";

function App() {
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const profileComplete = useSelector((state) => state.auth.profileComplete);

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    dispatch(
      setUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        profileImage: user.imageUrl,
        name: user.fullName,
        role: user.publicMetadata?.role || null,
        profileComplete: user.publicMetadata?.isProfileComplete || false
      })
    );
  }, [isSignedIn, user, dispatch]);

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"} min-h-screen overflow-x-hidden`}>
      <InitUser>

        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />

          <Route path="/auth" element={<Navigate to="/" />} />
          <Route path="/dummy" element={<MotivationBanner/>}/>

          <Route path="/set-role" element={isSignedIn && !role ? <RoleSelection /> : <Navigate to="/dashboard" />} />

          <Route
            path="/job/:id"
            element={
              isSignedIn ? (
                <JobDetails />
              ) : (
                <SigninWarn />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              !isSignedIn ? (
                <Navigate to="/auth" />
              ) : !role ? (
                <Navigate to="/set-role" />
              ) : !profileComplete ? (
                <SetProfile />
              ) : (
                <Dashboard />
              )
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />

            {role === "recruiter" && (
              <>
                <Route path="add-job" element={<RecruiterAddJob />} />
                <Route path="view-jobs" element={<RecruiterViewJobs />} />
                <Route path="view-applicants" element={<RecruiterViewApplicants />} />
              </>
            )}
            {role === "candidate" && (
              <>
                <Route path="applied-jobs" element={<CandidateAppliedJobs />} />
                <Route path="saved-jobs" element={<CandidateSavedJobs />} />
                <Route path="job-status" element={<CandidateViewJobStatus />} />
              </>
            )}
          </Route>
        </Routes>
        <Footer/>
      </InitUser>

    </div>
  );
}

export default App;
