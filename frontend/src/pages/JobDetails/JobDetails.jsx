import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../Context/ThemeContext';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const recruiter = useSelector((state) => state.auth.recruiterProfile)
  const { darkMode } = useContext(ThemeContext);

  const role = user?.role
  const isOwnJob = recruiter?.user === user?._id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = async (jobId) => {
    if (!jobId) return;

    try {
      const res = await axios.get(`http://localhost:4000/api/job/${jobId}`);
      if (res.data.success) {
        setJob(res.data.job);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      setError('Error fetching job');
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob(id);
  }, [id]);

  if (loading) return <p className="text-center mt-[85px]">Loading...</p>;
  if (error) return <p className="text-center mt-[85px] text-red-500">{error}</p>;
  if (!job) return <p className="text-center mt-[85px] text-red-500">Job not found.</p>;

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`mx-auto pt-[80px] px-6 py-5`}>
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <h2 className="text-xl font-semibold mb-2 text-green-600">{job.createdBy?.name}</h2>

        <div className="flex items-center gap-3 text-sm mb-4">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{job.createdBy?.companyDetails?.location || 'Unknown Location'}</span>
        </div>

        <div className="flex items-center gap-3 text-sm mb-6">
          <FaDollarSign className="text-gray-500" />
          <span>{job.salary}</span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Description:</h3>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Skills Required:</h3>
          <p className="text-gray-600">{job.skillsRequired.join(', ')}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Vacancies:</h3>
          <p className="text-gray-600">{job.numberOfVacancies}</p>
        </div>

        <div className="text-center mt-6">
          {role === 'recruiter' && isOwnJob ? (
            <button
              onClick={() => {
                console.log('View Applicants clicked');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              View Applicants
            </button>
          ) : role === "candidate" ? (
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Apply Now
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
