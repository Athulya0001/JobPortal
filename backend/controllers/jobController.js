import Job from "../models/jobModel.js";

// add jobs
export const addJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, numberOfVacancies, salary, thumbnail, createdBy } = req.body;

    if (!title || !description || !skillsRequired || !numberOfVacancies || !createdBy) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingJob = await Job.findOne({ title, createdBy });

    if (existingJob) {
      return res.status(400).json({ success: false, message: "Job with this title already exists for this recruiter" });
    }

    const newJob = new Job({
      title,
      description,
      skillsRequired,
      numberOfVacancies,
      salary,
      thumbnail,
      createdBy,
    });

    await newJob.save();
    res.status(201).json({ success: true, message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all jobs
export const getJobs = async (req, res) => {
    try {
      const { recruiterId } = req.params;
  
      const jobs = await Job.find({ createdBy: recruiterId }).populate("createdBy", "name email").exec();
  
      if (!jobs.length) {
        return res.status(404).json({ success: false, message: "No jobs found for this recruiter" });
      }
  
      return res.status(200).json({ success: true, jobs });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
