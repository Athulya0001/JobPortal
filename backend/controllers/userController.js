import { clerkClient } from "@clerk/clerk-sdk-node";
import User from '../models/userModel.js'

export const register = async (req, res) => {
  console.log("func called");
  console.log("req body", req.body);

  try {
    const { clerkId, name, email, profileImage, role } = req.body;
    
    if (!clerkId || !name || !email || !profileImage || !role) {
      console.error(" Missing fields in request body");
      return res.status(400).json({ error: "All fields are required" });
    }

    let existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      console.error(" User already exists");
      return res.status(400).json({ error: "User already registered" });
    }

    const newUser = new User({ clerkId, name, email, profileImage, role });
    await newUser.save();

    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        role,
        isProfileComplete: false,
      },
    });

    return res.status(201).json({ success: true, message: "User registered", user: newUser });
  } catch (error) {
    console.error("Error in register function:", error);
    return res.status(500).json({ success:false, error: "Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success:false, message: "User not found" });
    }
    console.log(user,"user===============")

    return res.status(200).json({ success:true, message:"User found", user: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ success:false, message: "Server error" });
  }
};


export const completeProfile = async (req, res) => {
  try {
    const { userId, role, ...details } = req.body;

    if (!userId) {
      console.error("Missing userId in request");
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    let updateData = { profileComplete: true };
    if (role === 'recruiter') {
      updateData.companyDetails = {
        name: details.companyName,
        website: details.website,
        location: details.location,
        description: details.description,
      };
      updateData.position = details.position;

      
    } else {
      updateData.resume = details.resume;
      updateData.skills = details.skills.split(",").map(skill => skill.trim());
    }
    console.log(updateData,"data")

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateData },
      { new: true }
    );
    console.log(updatedUser,"user")

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { isProfileComplete: true }
    });

    return res.status(200).json({success:true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    return res.status(500).json({success:false, error: "Internal server error" });
  }
};
