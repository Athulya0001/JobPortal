import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../Redux/Reducers/authSlice";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isSignedIn, user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      dispatch(
        setUser({
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          profileImage: user.imageUrl,
          name: `${user.firstName} ${user.lastName}`,
          role: null,
          profileComplete: false,
        })
      );
      navigate("/set-role");
    }
  }, [isSignedIn, user, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isSignUp ? <SignUp /> : <SignIn />}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 px-4 py-2 bg-[#0096ff] hover:bg-[#007acc] text-white rounded cursor-pointer"
      >
        {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
      </button>
    </div>
  );
};

export default AuthPage;
