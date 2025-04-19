import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    numberOfVacancies: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
    },
    location: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    shortlisted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    selected: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    isFilled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  this.isFilled = this.selected.length >= this.numberOfVacancies;
  next();
});

jobSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const jobId = this.getQuery()._id;

  if (update.selected) {
    const job = await this.model.findById(jobId);
    const selected = update.selected.length ? update.selected : job.selected;
    const numberOfVacancies = update.numberOfVacancies || job.numberOfVacancies;

    update.isFilled = selected.length >= numberOfVacancies;
  }

  next();
});

const Job = mongoose.model("Job", jobSchema);

export default Job;