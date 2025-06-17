import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoConnect from './mongoConnect.js'
import userRouter from './routes/userRoutes.js'
import jobRouter from './routes/jobRoutes.js'
import candidateRouter from './routes/candidateRoutes.js'
import recruiterRouter from './routes/recruiterRoutes.js'
import events from "events";

events.defaultMaxListeners = 20;

const app = express()
dotenv.config()

app.use(cors({
    origin: ["http://localhost:5173", "https://job-portal-five-pi.vercel.app"],
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/user', userRouter);
app.use("/api/job", jobRouter);
app.use("/api/recruiter", recruiterRouter)
app.use("/api/candidate", candidateRouter)

const port = process.env.PORT || 5000
mongoConnect().then(()=>{
    try {
        app.listen(port, ()=>{
            console.log("Server listening on port", port)
        })
    } catch (error) {
        console.log("Error listening to port", error)
    }
})
