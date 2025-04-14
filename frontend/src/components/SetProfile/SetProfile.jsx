import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { setUser } from "../../Redux/Reducers/authSlice";

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
          skills: [],
          resume: null,
        }
  );

  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("userId", id);
    formDataToSend.append("clerkId", clerkId);
    formDataToSend.append("role", role);

    for (const [key, value] of Object.entries(formData)) {
      if (key !== "resume") {
        formDataToSend.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      }
    }

    if (formData.resume) {
      formDataToSend.append("resume", formData.resume);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/complete-profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");

        dispatch(
          setUser({
            ...response.data.user,
            profileComplete: response.data.profileComplete,
            profile: response.data.profile,
          })
        );

        navigate("/");
      }
    } catch (err) {
      toast.error("Error updating profile, retry");
      console.error("Error creating profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-start min-h-screen pt-[100px] px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-lg p-8 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your {role === "recruiter" ? "Recruiter" : "Candidate"} Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {role === "recruiter" ? (
            <>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
                className={`rounded-xl p-3 border text-base font-medium ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
              <input
                type="text"
                name="website"
                placeholder="Company Website"
                value={formData.website}
                onChange={handleChange}
                className={`rounded-xl p-3 border text-base font-medium ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
              <input
                type="text"
                name="location"
                placeholder="Company Location"
                value={formData.location}
                onChange={handleChange}
                className={`rounded-xl p-3 border text-base font-medium ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
              <textarea
                name="description"
                placeholder="Company Description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`rounded-xl p-3 border text-base font-medium resize-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
              <input
                type="text"
                name="position"
                placeholder="Your Position"
                value={formData.position}
                onChange={handleChange}
                required
                className={`rounded-xl p-3 border text-base font-medium ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  className={`rounded-xl p-3 border text-base font-medium ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-[#0096FF] text-white py-2 px-4 rounded-xl mt-2 hover:bg-[#007ACC] transition-colors duration-200"
                >
                  Add Skill
                </button>
              </div>

              <ul className="mt-4">
                {formData.skills.map((skill, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleFileChange}
                required
                className={`rounded-xl p-3 border text-base font-medium ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0096FF] hover:bg-[#007ACC] text-white py-3 rounded-xl text-lg font-semibold shadow-md transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetProfile;