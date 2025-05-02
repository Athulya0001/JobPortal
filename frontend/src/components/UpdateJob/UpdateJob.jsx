import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../Context/ThemeContext";
import { JobContext } from "../../Context/JobContext";
import Loading from "../Loading/Loading";

const UpdateJob = () => {
  const { jobId } = useParams();
  const { darkMode } = useContext(ThemeContext);
  const { updateJob } = useContext(JobContext);
  const allJobs = useSelector((state) => state.jobs.allJobs);
  const job = allJobs.find((j) => j._id === jobId);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    numberOfVacancies: 1,
    salary: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        skillsRequired: job.skillsRequired,
        numberOfVacancies: job.numberOfVacancies,
        salary: job.salary,
      });
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSkillAdd = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skillsRequired.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, trimmed],
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateJob(jobId, formData);
    setLoading(false);
    navigate("/dashboard");
  };

  if (!job) return <Loading />;

  return (
    <div
      className={`min-h-screen px-4 flex justify-center items-start pt-10 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-xl p-8 rounded-xl shadow-xl ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Job</h2>

        <input
          name="title"
          placeholder="Title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className={`w-full mb-4 p-2 rounded-md border ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className={`w-full mb-4 p-2 rounded-md border h-32 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />

        <div className="mb-4">
          <label className="block mb-1">Skills Required</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSkillAdd();
                }
              }}
              placeholder="Enter a skill"
              className={`flex-1 p-2 rounded-md border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white border-gray-300"
              }`}
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
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-2"
              >
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
          className={`w-full mb-4 p-2 rounded-md border ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />

        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className={`w-full mb-6 p-2 rounded-md border ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#0096ff] text-white font-semibold rounded-md hover:bg-[#007acc] transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
};

export default UpdateJob;
