import User from './userModel.js'

const recruiterSchema = new mongoose.Schema({
    role: { type: String, default: 'recruiter' },
    companyDetails: {
      name: { type: String, required: true },
      website: String,
      location: String,
      description: String
    },
    position: { type: String, required: true },
    createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
  });

const Recruiter = User.discriminator('Recruiter', recruiterSchema);

export default Recruiter