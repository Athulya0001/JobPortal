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
  try {
    const { userId, clerkId, role, ...details } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });

    const updatedUser = await User.findById(userId);
    if (!updatedUser) return res.status(404).json({ success: false, error: "User not found" });

    let profileDoc;

    if (role === "recruiter") {
      const recruiterData = {
        companyDetails: {
          name: details.companyName,
          website: details.website,
          location: details.location,
          description: details.description,
        },
        position: details.position,
        clerkId,
        profileComplete: true,
      };

      profileDoc = await Recruiter.findOneAndUpdate(
        { user: userId },
        recruiterData,
        { upsert: true, new: true }
      );

    } else if (role === "candidate") {
      const candidateData = {
        resume: details.resume,
        skills: details.skills,
        clerkId,
        profileComplete: true,
      };

      profileDoc = await Candidate.findOneAndUpdate(
        { user: userId },
        candidateData,
        { upsert: true, new: true }
      );

    } else {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profile: profileDoc,
      profileComplete: true,
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};