import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { ThemeContext } from "../../Context/ThemeContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import {Link} from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RecruiterJobStatus = () => {
  const { darkMode } = useContext(ThemeContext);
  const user = useSelector((state) => state.auth.user);
  const recruiter = useSelector((state) => state.auth.recruiterProfile);

  if (!recruiter || user?.role !== "recruiter") return null;

  const jobs = recruiter.jobsCreated || [];

  return (
    <section
      className={`py-10 px-4 transition duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#0096FF]">
          Your Job Overview
        </h2>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-400">
            You haven’t created any job postings yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const chartData = {
                labels: ["Vacancies", "Applicants", "Shortlisted", "Selected"],
                datasets: [
                  {
                    label: job.title,
                    data: [
                      job.numberOfVacancies || 0,
                      job.applicants?.length || 0,
                      job.shortlisted?.length || 0,
                      job.selected?.length || 0,
                    ],
                    backgroundColor: [
                      "#6366F1", // Indigo
                      "#0096FF", // Blue
                      "#34D399", // Green
                      "#F59E0B", // Amber
                    ],
                    borderRadius: 8,
                  },
                ],
              };

              const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? "#fff" : "#000",
                    },
                    grid: {
                      color: darkMode ? "#444" : "#e5e7eb",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                      color: darkMode ? "#fff" : "#000",
                    },
                    grid: {
                      color: darkMode ? "#444" : "#e5e7eb",
                    },
                  },
                },
              };

              return (
                <div
                  key={job._id}
                  className={` ${darkMode ? "bg-gray-800": "bg-gray-100"} p-4 rounded-lg shadow`}
                >
                  <Link to={`/job/${job._id}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:underline text-[#0096FF]">
                      {job.title}
                    </h3>
                  </Link>
                  <div className="relative h-60">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecruiterJobStatus