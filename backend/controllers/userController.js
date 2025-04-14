import { clerkClient } from "@clerk/clerk-sdk-node";
import User from '../models/userModel.js'
import Recruiter from "../models/recruiterModel.js";
import Candidate from "../models/candidateModel.js";

// user registration
export const register = async (req, res) => {
  try {
    const { clerkId, name, email, profileImage, role } = req.body;

    if (!role) {
      return res.status(400).json({ success:false, error: "Role is required" });
    }

    let existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(404).json({ success:false, error: "User already exists", user: existingUser });
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
      profile = await Recruiter.findOne({ clerkId:clerkId });
    } else if (user.role === "candidate") {
      profile = await Candidate.findOne({ clerkId:clerkId });
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
    const user = await User.findById(userId);

    if (req.file) {
      const resumeUrl = req.file.path;

      if (role === "candidate") {
        user.candidateProfile = { ...profileData, resume: resumeUrl, skills: JSON.parse(skills) };
      } else if (role === "recruiter") {
        user.recruiterProfile = { ...profileData };
      }
    }

    user.profileComplete = true;
    await user.save();

    res.status(200).json({
      success: true,
      user,
      profileComplete: true,
      profile: user[role + "Profile"],
    });
  } catch (error) {
    console.error("Error saving profile", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};