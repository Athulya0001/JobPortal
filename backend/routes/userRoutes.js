import express from 'express'
import {register, completeProfile, getUserData} from '../controllers/userController.js'
import requireAuth from '../middleware/requireAuth.js'
import { uploadFile} from '../middleware/multerPdfConfig.js';


const userRouter = express.Router();

userRouter.post("/register", requireAuth, register)
userRouter.get("/:clerkId",requireAuth, getUserData)
userRouter.post("/complete-profile", uploadFile.single("resumes"),requireAuth, completeProfile);


export default userRouter