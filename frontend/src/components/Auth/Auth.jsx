import { useState } from "react";
import { SignIn, SignUp, useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Reducers/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    // setError("");

    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:4000/api/user/register",
        {
          clerkId: user.id,
          name: user.firstName + " " + user.lastName,
          email: user.primaryEmailAddress?.emailAddress,
          profileImage: user.imageUrl,
          role
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response,"res")
      dispatch(setUser(response.data.user));
      if(response.data.success) navigate("/")
    } catch (err) {
      // setError(err.response?.data?.error || "Failed to register");
      console.log("Error registering user", err)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isSignedIn && !user?.role  ? (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Select Your Role</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Choose a role</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
              disabled={!role}
            >Set Role
            </button>
          </form>
        </div>
      ) : (
        <>
          {isSignUp ? <SignUp /> : <SignIn />}
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