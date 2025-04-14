import express from 'express'
import {register, completeProfile, getUserData} from '../controllers/userController.js'
import requireAuth from '../middleware/requireAuth.js'
import upload from '../middleware/multerConfig.js';


const userRouter = express.Router();

userRouter.post("/register", requireAuth, register)
userRouter.get("/:clerkId",requireAuth, getUserData)
userRouter.post("/complete-profile", upload.single("resume"),requireAuth, completeProfile);

export default userRouter