import Job from "../models/jobModel.js";
import Recruiter from "../models/recruiterModel.js";

// add jobs
export const addJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, numberOfVacancies, salary, createdBy } = req.body;
    const thumbnail = req.file?.path || req.file

    if (
      !title ||
      !description ||
      !skillsRequired ||
      !numberOfVacancies ||
      !createdBy ||
      !thumbnail
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const parsedSkills = JSON.parse(skillsRequired);

    const existingJob = await Job.findOne({ title, createdBy });
    if (existingJob) {
      return res.status(400).json({ success: false, message: "Job with this title already exists for this recruiter" });
    }

    const newJob = new Job({
      title,
      description,
      skillsRequired: parsedSkills,
      numberOfVacancies,
      salary,
      createdBy,
      thumbnail,
    });

    await newJob.save();

    await Recruiter.findByIdAndUpdate(createdBy, {
      $push: { createdJobs: newJob._id },
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });

  } catch (error) {
    console.error("Error adding job:", error.message);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// job details
export const getAllJobs = async (req,res) => {
  try {
    const allJobs = await Job.find()
    return res.status(200).json({success:true, jobs: allJobs})
  } catch (error) {
    return res.status(500).json({success: false, message: "Error getting jobs, server error"})
  }
}

// get job by jobid
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("createdBy", "name email companyDetails");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
