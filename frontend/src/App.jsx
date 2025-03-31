import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { setUser } from "./Redux/Reducers/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Auth from "./components/Auth/Auth";
import ProtectedPage from "./components/Auth/ProtectedPage";
import Home from './components/Home/Home';
import { ToastContainer } from 'react-toastify';
import SetProfile from './components/SetProfile/SetProfile'
import RecruiterHome from './components/Home/RecruiterHome';
import CandidateHome from './components/Home/CandidateHome';

function App() {
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const isProfileComplete = useSelector((state) => state.auth.user?.profileComplete);

  useEffect(() => {
    if (isSignedIn && user) {
      dispatch(
        setUser({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          role: user.publicMetadata?.role || "", 
          profileComplete: user.publicMetadata?.isProfileComplete || false, 
       })
      );
    }
  }, [isSignedIn, user, dispatch]);
  

  return (
    <div>
      <ToastContainer />
      <Routes>
      {!isSignedIn ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        ) : !isProfileComplete ? (
          <>
            <Route path="/complete-profile" element={<SetProfile />} />
            <Route path="*" element={<Navigate to="/complete-profile" />} />
          </>
        ) : role === "recruiter" ? (
          <>
            <Route path="/" element={<RecruiterHome />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<CandidateHome />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App