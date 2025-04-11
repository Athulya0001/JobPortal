import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { setUser } from "../../Redux/Reducers/authSlice";
import { toast } from "react-toastify";
import { ThemeContext } from "../../Context/ThemeContext";

const RoleSelection = () => {
  const user = useSelector((state) => state.auth.user);
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !user) return;

    try {
      const token = await getToken();
      const res = await axios.post(
        "http://localhost:4000/api/user/register",
        {
          clerkId: user.clerkId,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setUser({ ...res.data.user }));
      if (res.data.success) toast.success("Role selected successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error selecting role");
      console.error("Role registration failed:", error);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen pt-[100px] px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-lg p-8 transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h2 className="text-3xl font-extrabold text-center mb-8 tracking-tight">
          Select Your Role
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block mb-2 text-lg font-semibold">
              Choose a role:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={`w-full rounded-xl border px-4 py-3 text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${darkMode
                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:ring-green-600"
                }`}
            >
              <option value="">Select</option>
              <option value="recruiter">Recruiter</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition-colors duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>

  );
};

export default RoleSelection;
