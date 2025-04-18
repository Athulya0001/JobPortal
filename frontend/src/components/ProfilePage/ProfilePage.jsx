import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaFileAlt,
  FaUserEdit,
  FaTimes,
} from "react-icons/fa";
import { ThemeContext } from "../../Context/ThemeContext";
import { toast } from "react-toastify";
import { setUser } from "../../Redux/Reducers/authSlice";
import Loading from "../Loading/Loading";

const ProfilePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile =
    user?.role === "recruiter"
      ? useSelector((state) => state.auth.recruiterProfile)
      : useSelector((state) => state.auth.candidateProfile);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    user?.role === "recruiter"
      ? {
        companyName: profile?.companyDetails?.name || "",
        website: profile?.companyDetails?.website || "",
        location: profile?.companyDetails?.location || "",
        description: profile?.companyDetails?.description || "",
        position: profile?.position || "",
      }
      : {
        resume: profile?.resume || null,
        skills: profile?.skills || [],
      }

  );

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("userId", user._id);
      formPayload.append("clerkId", user.clerkId);
      formPayload.append("role", user.role);

      if (user.role === "recruiter") {
        formPayload.append("companyName", formData.companyName);
        formPayload.append("website", formData.website);
        formPayload.append("location", formData.location);
        formPayload.append("description", formData.description);
        formPayload.append("position", formData.position);
      } else {
        formPayload.append("skills", JSON.stringify(formData.skills));
        if (formData.resume instanceof File) {
          formPayload.append("resume", formData.resume);
        }
      }

      const response = await axios.post(
        "http://localhost:4000/api/user/complete-profile",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated!");
        dispatch(
          setUser({
            ...response.data.user,
            profileComplete: response.data.profileComplete,
            profile: response.data.profile,
          })
        );
        setEditMode(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile)
    return <div><Loading/></div>

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
    >
      <div
        className={`max-w-3xl w-full rounded-2xl shadow-2xl p-8 ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-[#0096FF]">
            Profile Details
          </h1>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-[#0096FF] hover:text-[#007acc] text-2xl"
              title="Edit Profile"
            >
              <FaUserEdit />
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-6">
            <p className="text-lg font-semibold">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-lg font-semibold">
              <strong>Role:</strong> {user.role}
            </p>

            {user.role === "recruiter" ? (
              <div className="space-y-6">
                <p className="flex items-center gap-2 text-lg">
                  <FaBuilding /> {profile?.companyDetails?.name || "N/A"}
                </p>
                <p className="flex items-center gap-2 text-lg">
                  <FaMapMarkerAlt />{" "}
                  {profile?.companyDetails?.location || "N/A"}
                </p>
                <p className="text-lg font-semibold">
                  <strong>Position:</strong> {profile?.position || "N/A"}
                </p>
                <div className="p-6 rounded-xl shadow-md bg-opacity-95">
                  <h2 className="text-2xl font-semibold mb-4 text-[#0096FF]">
                    About Company
                  </h2>
                  <p>
                    <span className="font-medium text-[#0096FF]">
                      Description:
                    </span>{" "}
                    {profile?.companyDetails?.description || (
                      <span className="italic text-gray-400">N/A</span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium text-[#0096FF]">Website:</span>{" "}
                    {profile?.companyDetails?.website ? (
                      <a
                        href={profile.companyDetails.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0096FF] hover:underline"
                      >
                        {profile.companyDetails.website}
                      </a>
                    ) : (
                      <span className="italic text-gray-400">N/A</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-lg">
                  <FaFileAlt /> <strong>Resume:</strong>
                </p>
                {profile?.resume ? (
                  <div className="flex justify-center">
                    <iframe
                      src={profile.resume}
                      title="Resume Preview"
                      width="100%"
                      height="500px"
                      className="rounded-md shadow-lg border"
                    />
                  </div>
                ) : (
                  <p className="italic text-gray-400">No resume uploaded.</p>
                )}
                <p className="text-lg font-semibold">
                  <strong>Skills:</strong>{" "}
                  {profile?.skills?.join(", ") || "N/A"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4 text-base">
            {user.role === "recruiter" ? (
              <>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full p-3 rounded-md border shadow-md"
                />
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Company Website"
                  className="w-full p-3 rounded-md border shadow-md"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Company Location"
                  className="w-full p-3 rounded-md border shadow-md"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Company Description"
                  className="w-full p-3 rounded-md border shadow-md resize-none"
                />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Your Position"
                  className="w-full p-3 rounded-md border shadow-md"
                />
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, resume: e.target.files[0] })
                  }
                  className="w-full p-3 rounded-md border shadow-md"
                />
                {formData.resume && typeof formData.resume === "object" && (
                  <p className="text-sm text-gray-500">
                    Selected file: {formData.resume.name}
                  </p>
                )}

                {formData.resume && typeof formData.resume === "string" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Current Resume Preview:</p>
                    <iframe
                      src={formData.resume}
                      title="Resume Preview"
                      width="100%"
                      height="400px"
                      className="rounded-md shadow-md border"
                    />
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1">Skills</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 p-2 border rounded-md shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-[#0096FF] hover:bg-[#007acc] text-white px-4 py-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-blue-600 hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className="flex gap-6 mt-6 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0096FF] hover:bg-[#007acc] text-white py-3 px-6 rounded-md transition-all duration-200 text-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white py-3 px-6 rounded-md transition-all duration-200 text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
