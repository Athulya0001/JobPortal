import { SignIn, SignUp, useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [role, setRole] = useState("");

  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserExists = async () => {
      if (!isSignedIn || !user) return;

      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:4000/api/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(setUser(res.data.user));
        navigate("/");
      } catch (err) {
        if (err.response?.status === 404) {
          setShowRoleForm(true);
        } else {
          console.error("Error checking user:", err);
        }
      }
    };

    checkUserExists();
  }, [isSignedIn, user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const res = await axios.post(
        "http://localhost:4000/api/user/register",
        {
          clerkId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.primaryEmailAddress.emailAddress,
          profileImage: user.imageUrl,
          role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setUser(res.data.user));
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex mt-[85px] flex-col items-center justify-center min-h-screen bg-gray-100">
      {showRoleForm ? (
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Select Your Role</h2>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          >
            <option value="">Choose a role</option>
            <option value="recruiter">Recruiter</option>
            <option value="candidate">Candidate</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Continue
          </button>
        </form>
      ) : (
        <>
          {isSignUp ? (
            <SignUp />
          ) : (
            <SignIn afterSignIn={() => navigate("/")} />
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
          </button>
        </>
      )}
    </div>
  );
};

export default Auth;

