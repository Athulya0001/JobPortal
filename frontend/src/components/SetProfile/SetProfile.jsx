import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../Redux/Reducers/authSlice";
import { toast } from "react-toastify";
import { ThemeContext } from "../../Context/ThemeContext";

const SetProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const id = user?._id;
  const clerkId = user?.clerkId;
  const role = user?.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState(
    role === "recruiter"
      ? {
        companyName: "",
        website: "",
        location: "",
        description: "",
        position: "",
      }
      : {
        resume: "",
        skills: "",
      }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/complete-profile",
        {
          userId: id,
          clerkId,
          role,
          ...formData,
          ...(role === "candidate" && {
            skills: formData.skills.split(",").map((s) => s.trim()),
          }),
        }
      );

      if (response.data.success) toast.success("Profile updated successfully");

      dispatch(
        setUser({
          ...response.data.user,
          profileComplete: response.data.profileComplete,
          profile: response.data.profile,
        })
      );

      navigate("/");
    } catch (err) {
      toast.error("Error updating profile, retry");
      console.error("Error creating profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-start min-h-screen pt-[100px] px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-md p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Complete Your {role === "recruiter" ? "Recruiter" : "Candidate"} Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {role === "recruiter" ? (
            <>
              <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="rounded-md p-2 border" />
              <input type="text" name="website" placeholder="Company Website" value={formData.website} onChange={handleChange} className="rounded-md p-2 border" />
              <input type="text" name="location" placeholder="Company Location" value={formData.location} onChange={handleChange} className="rounded-md p-2 border" />
              <textarea name="description" placeholder="Company Description" value={formData.description} onChange={handleChange} className="rounded-md p-2 border resize-none" />
              <input type="text" name="position" placeholder="Your Position" value={formData.position} onChange={handleChange} required className="rounded-md p-2 border" />
            </>
          ) : (
            <>
              <input type="text" name="resume" placeholder="Resume Link" value={formData.resume} onChange={handleChange} required className="rounded-md p-2 border" />
              <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange} required className="rounded-md p-2 border" />
            </>
          )}

          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetProfile;