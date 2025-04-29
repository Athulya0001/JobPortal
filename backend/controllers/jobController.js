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

// delete job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    await Job.findByIdAndDelete(jobId);
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateFields = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateFields, { new: true });

    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, updatedJob, jobs });
  } catch (err) {
    console.error("Update Job Error:", err);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
}

// job details
export const getAllJobs = async (req, res) => {
  try {
    const allJobs = await Job.find()
      .populate({
        path: "createdBy",
        select: "companyDetails name email"
      });

    return res.status(200).json({ success: true, jobs: allJobs });
  } catch (error) {
    console.error("Error getting jobs:", error);
    return res.status(500).json({ success: false, message: "Error getting jobs, server error" });
  }
};

// get job by jobid
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("createdBy", "name email companyDetails");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
