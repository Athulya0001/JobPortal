import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { toast } from "react-toastify";
import { addJob, setJobs } from "../../Redux/Reducers/jobSlice";

const RecruiterAddJob = () => {
  const { darkMode } = useContext(ThemeContext);
  const recruiter = useSelector((state) => state.auth.recruiterProfile)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const id = recruiter?._id

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    numberOfVacancies: 1,
    salary: "",
    thumbnail: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(",").map(skill => skill.trim()),
        createdBy: recruiter._id,
      };

      const res = await axios.post("http://localhost:4000/api/job/add", payload);

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
    <div className={`min-h-screen pt-[100px] px-4 flex justify-center items-start ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-xl p-8 rounded-xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Job</h2>

        {["title", "description", "skillsRequired", "numberOfVacancies", "salary", "thumbnail"].map((field) => (
          field === "description" ? (
            <textarea
              key={field}
              name={field}
              placeholder="Description"
              value={formData[field]}
              onChange={handleChange}
              required={["title", "description", "skillsRequired", "numberOfVacancies"].includes(field)}
              className={`w-full mb-4 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"} h-32`}
            />
          ) : (
            <input
              key={field}
              name={field}
              placeholder={field === "skillsRequired" ? "Skills (comma separated)" : field[0].toUpperCase() + field.slice(1)}
              type={field === "numberOfVacancies" || field === "salary" ? "number" : "text"}
              value={formData[field]}
              onChange={handleChange}
              required={["title", "description", "skillsRequired", "numberOfVacancies"].includes(field)}
              className={`w-full mb-4 p-2 rounded-md border ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
            />
          )
        ))}


        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default RecruiterAddJob