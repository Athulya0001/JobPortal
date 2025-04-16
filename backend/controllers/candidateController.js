import Candidate from "../models/candidateModel.js";
import Job from "../models/jobModel.js";

// save jobs
export const saveJob = async (req, res) => {
    const { jobId } = req.params;
    const { candidateId } = req.body;
  
    try {
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found." });
  
      const alreadySaved = candidate.savedJobs.includes(jobId);
  
      if (alreadySaved) {
        candidate.savedJobs.pull(jobId);
        await candidate.save();
        return res.status(200).json({ success: true, message: "Job unsaved successfully." ,savedJobs: candidate.savedJobs,});
      } else {
        candidate.savedJobs.push(jobId);
        await candidate.save();
        return res.status(200).json({ success: true, message: "Job saved successfully.",savedJobs: candidate.savedJobs, });
      }
    } catch (error) {
      console.error("Error saving job:", error);
      return res.status(500).json({ success: false, message: "Failed to save job." });
    }
  };

// applying for a job
export const applyJobs = async (req, res) => {
    const { jobId } = req.params;
    const { candidateId } = req.body;
    console.log(req.params)
  
    try {
      const job = await Job.findById(jobId);
      console.log(job)
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }
  
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found.' });
      }
  
      if (job.applicants.includes(candidateId)) {
        return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
      }
  
       if (job.isFilled) {
        return res.status(400).json({ success: false, message: 'This job is already filled.' });
      }
  
      job.applicants.push(candidateId);
  
  
      await job.save();
  
      candidate.appliedJobs.push(jobId);
      await candidate.save();
  
      return res.status(200).json({ success: true, message: 'Application submitted successfully.' });
    } catch (error) {
      console.error('Error applying for job:', error);
      return res.status(500).json({ success: false, message: 'Failed to apply for the job.', error: error.message });
    }
  }