import Candidate from '../models/candidateModel.js';
import Recruiter from '../models/recruiterModel.js';

export const registerRecruiter = async (req, res) => {
    console.log("==================")
  try {
    const { clerkId, name, email, profileImage } = req.body;
    console.log(req.body,"body=============")

    const recruiter = new Recruiter({
      clerkId,
      name,
      email,
      profileImage,
      position: 'HR', // default or send from frontend
      companyDetails: {
        name: 'Company Name',
      },
    });

    await recruiter.save();

    console.log(recruiter,"recruter===================")
    return res.status(201).json({ success: true, user: recruiter });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const registerCandidate = async (req, res) => {
  try {
    const { clerkId, name, email, profileImage } = req.body;

    const candidate = new Candidate({
      clerkId,
      name,
      email,
      profileImage,
      resume: '', // set default or get from frontend
      skills: [],
    });

    await candidate.save();

    return res.status(201).json({ success: true, user: candidate });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
