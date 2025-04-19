import Job from "../models/jobModel.js";
import Candidate from "../models/candidateModel.js";
import Recruiter from "../models/recruiterModel.js";

// update candidate job s
export const updateCandidateStatus = async (req, res) => {
  const { jobId } = req.params;
  const { candidateId, action } = req.body;

  if (!action || (action !== 'shortlist' && action !== 'select')) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(400).json({ message: 'No Job found' });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(400).json({ message: 'Candidate not found' });

    if (action === 'shortlist') {
      if (!job.shortlisted.includes(candidateId)) {
        job.shortlisted.push(candidateId);
        candidate.shortlistedJobs.push(jobId);
      }
    } else if (action === 'select') {
      job.shortlisted = job.shortlisted.filter(
        (id) => id.toString() !== candidateId.toString()
      );
      candidate.shortlistedJobs = candidate.shortlistedJobs.filter(
        (id) => id.toString() !== jobId.toString()
      );
    
      if (!job.selected.includes(candidateId)) {
        job.selected.push(candidateId);
        candidate.selectedJobs.push(jobId);
      }
    }

    await job.save();
    await candidate.save();
    return res.status(200).json({ success: true, message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`, isFilled: job.isFilled, candidate:candidate, job: job});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
