import express from 'express'
import {register, completeProfile, getUserData,getUserByClerkId} from '../controllers/userController.js'
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import requireAuth from '../middleware/requireAuth.js'
import {registerCandidate, registerRecruiter} from '../controllers/usersController.js'


const userRouter = express.Router();

userRouter.post("/register", requireAuth, register)
userRouter.get("/:id", getUserByClerkId)
// userRouter.post("/candidate/register",requireAuth,registerCandidate)
// userRouter.post("/recuiter/register",requireAuth,registerRecruiter)
// userRouter.get("/:clerkId", getUserData)
userRouter.post("/complete-profile", requireAuth, completeProfile)

export default userRouter