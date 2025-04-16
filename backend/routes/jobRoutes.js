import express from "express";
import { uploadFile} from "../middleware/multerPdfConfig.js";
import { addJob, getAllJobs, getJobById } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/add", uploadFile.single("thumbnail"), addJob);
jobRouter.get("/:id", getJobById);
jobRouter.get("/",getAllJobs)

export default jobRouter;