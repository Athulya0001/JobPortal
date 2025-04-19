import requireAuth from '../middleware/requireAuth.js'
import express from 'express'
import { updateCandidateStatus } from '../controllers/recruiterController.js'

const recruiterRouter = express.Router()

recruiterRouter.post("/update-candidate-status/:jobId", requireAuth, updateCandidateStatus);

export default recruiterRouter