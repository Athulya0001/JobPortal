import Job from "../models/jobModel.js";
import Candidate from "../models/candidateModel.js";
import Recruiter from "../models/recruiterModel.js";
import {sendMail} from '../utils/sendMail.js'

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

    const candidate = await Candidate.findById(candidateId).populate('user');
    console.log(candidate,"candidate")
    if (!candidate) return res.status(400).json({ message: 'Candidate not found' });

    if (action === 'shortlist') {
      if (!job.shortlisted.includes(candidateId)) {
        job.shortlisted.push(candidateId);
        candidate.shortlistedJobs.push(jobId);
        await sendMail(
          candidate.user.email,
          'You have been shortlisted!',
          `<p>Hi ${candidate.user.name},</p>
           <p>You have been <strong>shortlisted</strong> for the job <strong>${job.title}</strong>.</p>
           <p>Warm regards,<br/>
            The NextHire Team</p>`
        );
      }
    } else if (action === 'select') {
      job.shortlisted = job.shortlisted.filter(id => id.toString() !== candidateId);
      candidate.shortlistedJobs = candidate.shortlistedJobs.filter(id => id.toString() !== jobId);

      if (!job.selected.includes(candidateId)) {
        job.selected.push(candidateId);
        candidate.selectedJobs.push(jobId);

        await sendMail(
          candidate.user.email,
          'Congratulations! You are selected!',
          `<p>Hi ${candidate.user.name},</p>
           <p>🎉 Congratulations! You have been <strong>selected</strong> for the job <strong>${job.title}</strong>.</p>
           <p>Warm regards,<br/>
            The NextHire Team</p>`
        );
      }

      if (job.selected.length >= job.numberOfVacancies) {
        job.isFilled = true;
        await job.save();

        const rejectedCandidates = await Candidate.find({
          _id: { $in: job.applicants.filter(
            id => !job.selected.includes(id)
          ) }
        }).populate('user');

        for (const rejected of rejectedCandidates) {
          await sendMail(
            rejected.user.email,
            'Vacancies Filled',
            `<p>Hi ${rejected.user.name},</p>
            <p>Thank you for taking the time to apply for the position of <strong>${job.title}</strong>.</p>
            <p>We wanted to let you know that the position has now been filled. Although you were not selected this time, we truly appreciate your interest in this opportunity and the effort you put into your application.</p>
            <p>We encourage you to keep an eye on other openings with us that match your skills and aspirations.</p>
            <p>Wishing you all the best in your job search.</p>
            <p>Warm regards,<br/>
            The NextHire Team</p>`

          );
        }
      }
    }

    await job.save();
    await candidate.save();

    return res.status(200).json({
      success: true,
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`,
      isFilled: job.isFilled,
      candidate,
      job
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
