import { clerkClient } from "@clerk/clerk-sdk-node";
import User from '../models/userModel.js'
import Recruiter from "../models/recruiterModel.js";
import Candidate from "../models/candidateModel.js";

// user registration
export const register = async (req, res) => {
  try {
    const { clerkId, name, email, profileImage, role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, error: "Role is required" });
    }

    let existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(404).json({ success: false, error: "User already exists", user: existingUser });
    }

    const newUser = new User({
      clerkId,
      name,
      email,
      profileImage,
      role,
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: "User registered", user: newUser });

  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// user fetching
export const getUserData = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let profile = null;

    if (user.role === "recruiter") {
      profile = await Recruiter.findOne({ clerkId: clerkId });
    } else if (user.role === "candidate") {
      profile = await Candidate.findOne({ clerkId: clerkId });
    }

    return res.status(200).json({
      user,
      profile,
      profileComplete: profile?.profileComplete || false,
    });
  } catch (error) {
    console.error("Error fetching user with profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// profile updating
export const completeProfile = async (req, res) => {
  const { userId, clerkId, role, skills, ...profileData } = req.body;

  try {
    if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let profileDoc;
    let resumeUrl;

    if (role === "candidate") {
      resumeUrl = req.file ? req.file.path : profileData.resume;
      console.log("Uploaded File:", req.file);

      let parsedSkills;
      try {
        parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch (error) {
        return res.status(400).json({ success: false, error: "Invalid skills format" });
      }

      const candidateData = {
        resume: resumeUrl,
        skills: parsedSkills,
        ...profileData,
        clerkId,
        profileComplete: true,
        user: userId,
      };

      profileDoc = await Candidate.findOneAndUpdate(
        { user: userId },
        candidateData,
        { upsert: true, new: true }
      );
    }
    else if (role === "recruiter") {
      const recruiterData = {
        companyDetails: {
          name: profileData.companyName,
          website: profileData.website,
          location: profileData.location,
          description: profileData.description,
        },
        position: profileData.position,
        clerkId,
        profileComplete: true,
        user: userId,
      };

      profileDoc = await Recruiter.findOneAndUpdate(
        { user: userId },
        recruiterData,
        { upsert: true, new: true }
      );
    } else {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    user.profileComplete = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user,
      profile: profileDoc,
      profileComplete: true,
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};