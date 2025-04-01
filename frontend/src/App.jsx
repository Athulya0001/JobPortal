import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { setUser } from "./Redux/Reducers/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Auth from "./components/Auth/Auth";
import ProtectedPage from "./components/Auth/ProtectedPage";
import Home from "./components/Home/Home";
import { ToastContainer } from "react-toastify";
import SetProfile from "./components/SetProfile/SetProfile";
import RecruiterHome from "./components/Home/RecruiterHome";
import CandidateHome from "./components/Home/CandidateHome";

function App() {
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const isProfileComplete = useSelector(
    (state) => state.auth.user?.profileComplete
  );

  const fetchUserData = async (clerkId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/${clerkId}`);
      const data = await response.json();
  
      if (data.success) {
        return data.user;
      } else {
        console.error("User fetch failed:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };
  
  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserData(user.id).then((mongoUser) => {
        if (mongoUser) {
          dispatch(
            setUser({
              clerkId: mongoUser.clerkId,
              email: mongoUser.email,
              role: mongoUser.role,
              profileComplete: mongoUser.isProfileComplete || false,
            })
          );
        }
      });
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
        ) :isSignedIn && role === "" || null ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" />} />{" "}
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

export default App;
