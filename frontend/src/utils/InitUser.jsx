import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { setUser } from "../Redux/Reducers/authSlice";

const InitUser = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserFromBackend();
  }, [isSignedIn, user, dispatch]);

  const fetchUserFromBackend = async () => {
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
  };

  return children;
};

export default InitUser;