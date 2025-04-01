import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: String,
  address: String,
  phone: String,
  role: { 
    type: String, 
    enum: ['candidate', 'recruiter'],
    default: 'candidate',
    required: true ,
  },
  authType: {
    type: String,
    enum: ['google', 'email'],
    default: 'google'
  }  
}, { 
  timestamps: true,
  discriminatorKey: 'role' 
});

const User = mongoose.model("User", userSchema);

export default User