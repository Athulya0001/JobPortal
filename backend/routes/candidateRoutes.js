import express from 'express'
import { applyJobs, saveJob } from '../controllers/candidateController.js';

const candidateRouter = express.Router();

candidateRouter.post("/apply/:jobId",applyJobs)
candidateRouter.post("/save-job/:jobId", saveJob)

export default candidateRouter