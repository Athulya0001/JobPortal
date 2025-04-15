import express from "express";
import { addJob, getAllJobs, getJobById } from "../controllers/jobController.js";
import { uploadFile} from "../middleware/multerPdfConfig.js";

const jobRouter = express.Router();

jobRouter.post("/add", uploadFile.single("thumbnail"), addJob);
jobRouter.get("/:id", getJobById);
jobRouter.get("/",getAllJobs)

export default jobRouter;