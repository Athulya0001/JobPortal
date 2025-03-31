import express from 'express'
import {register, completeProfile} from '../controllers/userController.js'
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import requireAuth from '../middleware/requireAuth.js'

const userRouter = express.Router();

userRouter.post("/register", requireAuth, register)
userRouter.post("/complete-profile", requireAuth, completeProfile)

export default userRouter