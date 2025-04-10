import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
    role: { type: String, default: 'recruiter', enum:['recruiter'] },
    companyDetails: {
      name: { type: String, required: true },
      website: String,
      location: String,
      description: String
    },
    position: { type: String, required: true },
    createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
  });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter