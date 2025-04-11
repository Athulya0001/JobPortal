import express from "express";
import { addJob, getJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/add", addJob);
jobRouter.get("/:recruiterId", getJobs)

export default jobRouter;