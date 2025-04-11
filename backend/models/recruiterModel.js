import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
  clerkId:{type:String, required:true},
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  role: { type: String, default: 'recruiter', enum: ['recruiter'] },
  companyDetails: {
    name: { type: String, required: true },
    website: String,
    location: String,
    description: String
  },
  position: { type: String, required: true },
  profileComplete: {type:Boolean, default: false , enum:[true,false]},
  createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;