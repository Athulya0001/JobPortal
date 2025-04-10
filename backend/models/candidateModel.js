import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    role: { type: String, default: 'candidate', enum: ['candidate'] },
    resume: { type: String, required: true },
    skills: [String],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    shortlistedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    selectedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
  });

const Candidate= mongoose.model('Candidate', candidateSchema)

export default Candidate