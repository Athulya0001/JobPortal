import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

const Dashboard = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`flex h-screen mt-[80px] ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <aside className={`w-64 p-6 space-y-4 shadow-md ${darkMode ? "bg-green-700 text-white" : "bg-green-500 text-black"}`}>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-2">
          <Link
            to="profile"
            className={`block px-4 py-2 rounded transition-all duration-200 ${darkMode ? "hover:bg-green-600" : "hover:bg-green-400"}`}
          >
            View Profile
          </Link>

          {role === "recruiter" ? (
            <>
              <Link
                to="add-job"
                className={`block px-4 py-2 rounded transition-all duration-200 ${darkMode ? "hover:bg-green-600" : "hover:bg-green-400"}`}
              >
                Add Job
              </Link>
              <Link
                to="view-jobs"
                className={`block px-4 py-2 rounded transition-all duration-200 ${darkMode ? "hover:bg-green-600" : "hover:bg-green-400"}`}
              >
                View Jobs
              </Link>
            </>
          ) : (
            <>
              <Link
                to="applied-jobs"
                className={`block px-4 py-2 rounded transition-all duration-200 ${darkMode ? "hover:bg-green-600" : "hover:bg-green-400"}`}
              >
                Applied Jobs
              </Link>
              <Link
                to="saved-jobs"
                className={`block px-4 py-2 rounded transition-all duration-200 ${darkMode ? "hover:bg-green-600" : "hover:bg-green-400"}`}
              >
                Saved Jobs
              </Link>
            </>
          )}
        </nav>
      </aside>

      <main className={`flex-1 overflow-y-auto p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;