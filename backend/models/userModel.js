import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: String,
  role: { 
    type: String, 
    enum: ['candidate', 'recruiter', 'guest'],
    default: 'guest',
    required: true ,
  },
}, { 
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User