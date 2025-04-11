import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { setUser } from "./Redux/Reducers/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import RoleSelection from "./components/RoleSelection/RoleSelection";
import SetProfile from "./components/SetProfile/SetProfile";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import RecruiterAddJob from "./components/Dashboard/RecruiterAddJob";
import RecruiterViewJobs from "./components/Dashboard/RecruiterViewJobs";
import CandidateAppliedJobs from "./components/Dashboard/CandidateAppliedJobs";
import CandidateSavedJobs from "./components/Dashboard/CandidateSavedJobs";
import JobDetails from "./pages/JobDetails/JobDetails";

function App() {
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const profileComplete = useSelector((state) => state.auth.profileComplete);


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
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to="/dashboard" />} />

        <Route path="/set-role" element={isSignedIn && !role ? <RoleSelection /> : <Navigate to="/dashboard" />} />

        <Route path="/job/:id" element={<JobDetails />} />

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
          <Route path="profile" element={<ProfilePage />} />

          {role === "recruiter" && (
            <>
              <Route path="add-job" element={<RecruiterAddJob />} />
              <Route path="view-jobs" element={<RecruiterViewJobs />} />
            </>
          )}
          {role === "candidate" && (
            <>
              <Route path="applied-jobs" element={<CandidateAppliedJobs />} />
              <Route path="saved-jobs" element={<CandidateSavedJobs />} />
            </>
          )}
        </Route>
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </div>
  );
}

export default App;
