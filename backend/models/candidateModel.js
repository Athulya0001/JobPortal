import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  clerkId:{type:String, required:true},
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  role: { type: String, default: 'candidate', enum: ['candidate'] },
  resume: { type: String, required: true },
  skills: [{ type: String }],
  profileComplete: {type:Boolean, default: false , enum:[true,false]},
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  shortlistedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  selectedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;