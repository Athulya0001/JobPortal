import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { ThemeContext } from '../../Context/ThemeContext';

const Dashboard = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const { darkMode } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex relative min-h-screen pt-[105px] md:pt-[72px] ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      <div className="md:hidden absolute top-[72px] left-4 z-50">
        <button
          onClick={toggleSidebar}
          className={`${darkMode ?"text-white hover:bg-gray-700":"text-gray-600 hover:bg-gray-200"} rounded-md p-2`}
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            darkMode ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-200 bg-opacity-30'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64 p-6 space-y-4 shadow-md transition-transform duration-300 ease-in-out
          ${darkMode ? 'bg-[#04375c] text-[#0096FF]' : 'bg-[#ddedfa] text-[#0096FF]'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 z-50
        `}
      >
        <div className="flex justify-between items-center">
          <Link to="/dashboard">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`md:hidden ${darkMode ?"text-white hover:bg-gray-700":"text-gray-600 hover:bg-gray-200"} rounded-md p-1`}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            to="profile"
            className="block px-4 py-2 rounded transition-all duration-200 hover:bg-[#007ACC] hover:text-gray-100"
          >
            View Profile
          </Link>

          {role === 'recruiter' ? (
            <>
              <Link
                to="add-job"
                className="block px-4 py-2 rounded transition-all duration-200 hover:bg-[#007ACC] hover:text-gray-100"
              >
                Add Job
              </Link>
              <Link
                to="view-jobs"
                className="block px-4 py-2 rounded transition-all duration-200 hover:bg-[#007ACC] hover:text-gray-100"
              >
                View Jobs
              </Link>
            </>
          ) : (
            <>
              <Link
                to="applied-jobs"
                className="block px-4 py-2 rounded transition-all duration-200 hover:bg-[#007ACC] hover:text-gray-100"
              >
                Applied Jobs
              </Link>
              <Link
                to="saved-jobs"
                className="block px-4 py-2 rounded transition-all duration-200 hover:bg-[#007ACC] hover:text-gray-100"
              >
                Saved Jobs
              </Link>
            </>
          )}
        </nav>
      </aside>

      <main
        className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
          isSidebarOpen ? 'overflow-hidden h-screen' : ''
        } ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;