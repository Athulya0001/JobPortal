import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { setUser } from "./Redux/Reducers/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Auth from "./components/Auth/Auth";
import ProtectedPage from "./components/Auth/ProtectedPage";
import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import SetProfile from "./components/SetProfile/SetProfile";
import RecruiterHome from "./pages/Home/RecruiterHome";
import CandidateHome from "./pages/Home/CandidateHome";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const isProfileComplete = useSelector(
    (state) => state.auth.user?.profileComplete
  );

  // Fetch and store MongoDB user data if signed in
  // useEffect(() => {
  //   const fetchUserData = async (clerkId) => {
  //     try {
  //       const response = await fetch(`http://localhost:4000/api/user/${clerkId}`);
  //       const data = await response.json();
  //       if (data.success) {
  //         dispatch(
  //           setUser({
  //             clerkId: data.user?.clerkId,
  //             email: data.user?.email,
  //             role: data.user?.role,
  //             profileComplete: data.user?.isProfileComplete || false,
  //           })
  //         );
  //       } else {
  //         console.error("User fetch failed:", data.error);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  //   if (isSignedIn && user) {
  //     fetchUserData(user?.id);
  //   }
  // }, [isSignedIn, user, dispatch]);

  // const fetchUserData = async (clerkId) => {
  //   try {
  //     const response = await fetch(`http://localhost:4000/api/user/${clerkId}`);
  //     const data = await response.json();
  
  //     if (data.success) {
  //       return data.user;
  //     } else {
  //       console.error("User fetch failed:", data.error);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //     return null;
  //   }
  // };
  
  // useEffect(() => {
  //   if (isSignedIn && user) {
  //     fetchUserData(user?.id).then((mongoUser) => {
  //       if (mongoUser) {
  //         dispatch(
  //           setUser({
  //             clerkId: mongoUser?.clerkId,
  //             email: mongoUser?.email,
  //             role: mongoUser?.role,
  //             profileComplete: mongoUser?.isProfileComplete || false,
  //           })
  //         );
  //       }
  //     });
  //   }
  // }, [isSignedIn, user, dispatch]);

  return (
    <div>
      <ToastContainer />
      <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/auth"
          element={!isSignedIn ? <Auth /> : <Navigate to="/dashboard" />}
        />

        {/* Personalized Dashboard Route for Signed-In Users */}
        <Route
          path="/dashboard"
          element={
            !isSignedIn ? (
              <Navigate to="/auth" />
            ) : !isProfileComplete ? (
              <SetProfile />
            ) : role === "recruiter" ? (
              <RecruiterHome />
            ) : (
              <CandidateHome />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
    </div>
  );
}

export default App;
