import express from "express";
import { addJob, getAllJobs, getJobById, getJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/add", addJob);
// jobRouter.get("/:recruiterId", getJobs)
jobRouter.get("/:id", getJobById);
jobRouter.get("/",getAllJobs)

export default jobRouter;