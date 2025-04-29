import { createContext, useContext, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { setUser } from "../Redux/Reducers/authSlice";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const fetchUserFromBackend = useCallback(async () => {
    if (!isSignedIn || !user) return;

    try {
      const token = await getToken();
      const res = await axios.get(`http://localhost:4000/api/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mongoUser = res.data.user;
      const profile = res.data.profile;
      const profileComplete = res.data.profileComplete;
      const jobsCreated = res.data.jobsCreated || [];

      dispatch(
        setUser({
          _id: mongoUser._id,
          clerkId: mongoUser.clerkId,
          email: mongoUser.email,
          profileImage: mongoUser.profileImage,
          name: mongoUser.name,
          role: mongoUser.role,
          profileComplete,
          profile,
          jobsCreated,
        })
      );
    } catch (error) {
      console.error("Error loading user from backend:", error.message);
    }
  }, [isSignedIn, user, getToken, dispatch]);

  useEffect(() => {
    fetchUserFromBackend();
  }, [fetchUserFromBackend]);

  return (
    <UserContext.Provider value={{ fetchUserFromBackend }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);