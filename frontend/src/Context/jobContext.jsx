import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs } from '../Redux/Reducers/jobSlice';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const recruiterId = useSelector((state) => state.auth.recruiterProfile?._id);

    const fetchJobs = async (id) => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:4000/api/job/${id}`);
            if (res.data.success) {
                dispatch(setJobs(res.data.jobs));
            }
        } catch (err) {
            setError('Error fetching jobs');
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(recruiterId);
    }, [recruiterId, dispatch]);

    return (
        <JobContext.Provider value={{ fetchJobs, loading, error }}>
            {children}
        </JobContext.Provider>
    );
};
