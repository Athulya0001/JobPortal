import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addJob as addJobToRedux, setAllJobs, setJobs } from '../Redux/Reducers/jobSlice';
import {toast} from 'react-toastify' 
import { updateCandidateSavedJobs } from '../Redux/Reducers/authSlice';
import { useNavigate } from 'react-router-dom';


export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const recruiterId = useSelector((state) => state.auth.recruiterProfile?._id)
  const candidate = useSelector(state => state.auth.candidateProfile);

   // Add job
   const addJob = async (formData, recruiterId, navigate) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("skillsRequired", JSON.stringify(formData.skillsRequired));
      formDataToSend.append("numberOfVacancies", formData.numberOfVacancies);
      formDataToSend.append("salary", formData.salary);
      formDataToSend.append("createdBy", recruiterId);

      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      const res = await axios.post("http://localhost:4000/api/job/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        dispatch(addJobToRedux(res.data.job));
        toast.success("Job posted successfully!");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Error posting job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Delete job
  const deleteJob = async (jobId) => {
    setLoading(true)
    try {
      const res = await axios.delete(`http://localhost:4000/api/job/${jobId}`);
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
        navigate("/dashboard")
        toast.success("Job deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while deleting job");
    } finally {
      setLoading(false);
    }
  };

  // Update job
  const updateJob = async (jobId, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/job/${jobId}`, updatedData);
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
        toast.success("Job updated successfully");
      } else {
        toast.error(res.data.message || "Failed to update job");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while updating job");
    }
  };

  // save jobs
  const handleToggleSave = async (jobId) => {
    if (!user || user.role !== 'candidate') return;
  
    try {
      const res = await axios.post(`http://localhost:4000/api/candidate/save-job/${jobId}`, {
        candidateId: candidate._id,
      });
  
      if (res.data.success) {
        dispatch(updateCandidateSavedJobs(res.data.savedJobs));
  
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update saved jobs.");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Error saving job.");
    }
  };

  // fetch all jobs
  const fetchAllJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/job`);
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
    
        if (recruiterId) {
          const recruiterJob = res.data.jobs.filter((job) => job.createdBy === recruiterId);
          dispatch(setJobs(recruiterJob));
        }
      }
    } catch (err) {
      setError('Error fetching all jobs');
      console.error("Error fetching all jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  

  return (
    <JobContext.Provider value={{addJob, deleteJob, updateJob, fetchAllJobs, handleToggleSave, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};
