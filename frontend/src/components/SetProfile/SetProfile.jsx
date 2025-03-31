import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../Redux/Reducers/authSlice";

const SetProfile = () => {
  const { id, role } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    role === "recruiter"
      ? {
          companyName: "",
          website: "",
          location: "",
          description: "",
          position: "",
        }
      : { resume: "", skills: "" }
  );

  const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/complete-profile",
        { userId: id, role, ...formData }
      );

      dispatch(setUser(response.data.user));
      navigate("/");
    } catch (err) {
        console.log("Error creating profile", err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-4">
        Complete Your {role === "recruiter" ? "Recruiter" : "Candidate"} Profile
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        {role === "recruiter" ? (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="website"
              placeholder="Company Website"
              value={formData.website}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="location"
              placeholder="Company Location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Company Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="position"
              placeholder="Your Position"
              value={formData.position}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="resume"
              placeholder="Resume Link"
              value={formData.resume}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={formData.skills}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default SetProfile;