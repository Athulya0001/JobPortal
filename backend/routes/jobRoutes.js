import express from "express";
import { uploadFile} from "../middleware/multerPdfConfig.js";
import { addJob, deleteJob, getAllJobs, getJobById, updateJob } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/add", uploadFile.single("thumbnail"), addJob);
jobRouter.get("/:id", getJobById);
jobRouter.get("/",getAllJobs)
jobRouter.delete("/:id", deleteJob);
jobRouter.put("/:id", updateJob);

export default jobRouter;