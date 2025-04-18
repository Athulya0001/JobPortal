import { Bar } from "react-chartjs-2"; // <-- use Bar for bar charts
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
                      "#6366F1", // Vacancies
                      "#0096FF", // Applicants
                      "#34D399", // Shortlisted
                      "#F59E0B", // Selected
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
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              };

              return (
                <div key={job._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <div className="relative h-60">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                  <p className="mt-3 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      Status:
                    </span>{" "}
                    {job.status || "Not specified"}
                  </p>
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