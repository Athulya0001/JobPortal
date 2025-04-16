import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { toast } from "react-toastify";
import { addJob, setJobs } from "../../Redux/Reducers/jobSlice";

const RecruiterAddJob = () => {
  const { darkMode } = useContext(ThemeContext);
  const recruiter = useSelector((state) => state.auth.recruiterProfile);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    numberOfVacancies: 1,
    salary: "",
    thumbnail: null,
  });


  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSkillAdd = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skillsRequired.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, trimmedSkill],
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("skillsRequired", JSON.stringify(formData.skillsRequired));
      formDataToSend.append("numberOfVacancies", formData.numberOfVacancies);
      formDataToSend.append("salary", formData.salary);
      formDataToSend.append("createdBy", recruiter._id);

      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axios.post("http://localhost:4000/api/job/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      if (res.data.success) {
        dispatch(addJob(res.data.job));
        toast.success("Job posted successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Error posting job");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`min-h-screen px-4 flex justify-center items-start ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-xl p-8 rounded-xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Job</h2>

        <input
          name="title"
          placeholder="Title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className={`w-full mb-4 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className={`w-full mb-4 p-2 rounded-md border h-32 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        />

        <div className="mb-4">
          <label className="block mb-1">Skills Required</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter a skill"
              className={`flex-1 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skillsRequired.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <input
          name="numberOfVacancies"
          type="number"
          placeholder="Number of Vacancies"
          value={formData.numberOfVacancies}
          onChange={handleChange}
          required
          className={`w-full mb-4 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        />

        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className={`w-full mb-6 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        />
        <input
          type="file"
          accept="image/*"
          placeholder="Thumbnail"
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
          className={`w-full mb-4 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        />


        <button
          type="submit"
          className="w-full py-2 bg-[#0096ff] text-white font-semibold rounded-md hover:bg-[#007acc] transition"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default RecruiterAddJob