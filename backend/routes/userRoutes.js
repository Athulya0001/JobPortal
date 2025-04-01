import express from 'express'
import {register, completeProfile, getUserData} from '../controllers/userController.js'
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import requireAuth from '../middleware/requireAuth.js'

const userRouter = express.Router();

userRouter.post("/register", requireAuth, register)
userRouter.get("/:clerkId", getUserData)
userRouter.post("/complete-profile", requireAuth, completeProfile)

export default userRouter