import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaFileAlt, FaTools, FaUserEdit } from "react-icons/fa";
import { ThemeContext } from "../../Context/ThemeContext";
import { toast } from "react-toastify";
import { setUser } from "../../Redux/Reducers/authSlice";

const ProfilePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = user?.role === "recruiter"
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
          resume: profile?.resume || "",
          skills: profile?.skills?.join(", ") || "",
        }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/user/complete-profile", {
        userId: user._id,
        clerkId: user.clerkId,
        role: user.role,
        ...formData,
      });

      if (response.data.success) {
        toast.success("Profile updated!");
        dispatch(setUser({
          ...response.data.user,
          profileComplete: response.data.profileComplete,
          profile: response.data.profile,
        }));
        setEditMode(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) return <p className="text-center mt-24">Loading profile...</p>;

  return (
    <div
      className={`min-h-screen pt-[100px] px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div
        className={`max-w-2xl mx-auto rounded-2xl shadow-xl p-8 transition-all duration-300 ${darkMode ? "bg-gray-800" : "bg-white"} bg-opacity-95 backdrop-blur-md`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile Details</h1>
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
          <div className="space-y-4 text-lg">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            {user.role === "recruiter" ? (
              <>
                <p className="flex items-center gap-2">
                  <FaBuilding /> {profile?.companyDetails?.name || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt /> {profile?.companyDetails?.location || "N/A"}
                </p>
                <p><strong>Position:</strong> {profile?.position || "N/A"}</p>
                <div className={`flex flex-col gap-2 p-4 rounded-xl shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
                  <h2 className="text-2xl font-semibold mb-2 border-b pb-1 border-[#0096FF]">About Company</h2>

                  <p className="text-base">
                    <span className="font-medium text-[#0096FF]">Description:</span>{" "}
                    {profile?.companyDetails?.description || <span className="italic text-gray-400">N/A</span>}
                  </p>

                  <p className="text-base">
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

              </>
            ) : (
              <>
                <p className="flex items-center gap-2"><FaFileAlt /> {profile?.resume || "N/A"}</p>
                <p className="flex items-center gap-2"><FaTools /> {profile?.skills?.join(", ") || "N/A"}</p>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4 text-base">
            {user.role === "recruiter" ? (
              <>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="w-full p-2 rounded-md border" />
                <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Company Website" className="w-full p-2 rounded-md border" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Company Location" className="w-full p-2 rounded-md border" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Company Description" className="w-full p-2 rounded-md border resize-none" />
                <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Your Position" className="w-full p-2 rounded-md border" />
              </>
            ) : (
              <>
                <input type="text" name="resume" value={formData.resume} onChange={handleChange} placeholder="Resume Link" className="w-full p-2 rounded-md border" />
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma-separated)" className="w-full p-2 rounded-md border" />
              </>
            )}
            <div className="flex gap-4 mt-4">
              <button type="submit" disabled={loading} className="bg-[#0096FF] hover:bg-[#007acc] text-white py-2 px-4 rounded-md transition-all duration-200">
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md transition-all duration-200">
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
