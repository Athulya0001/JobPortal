import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoConnect from './mongoConnect.js'
import requireAuth from './middleware/requireAuth.js'
import userRouter from './routes/userRoutes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE",
}))

dotenv.config()

const port = process.env.PORT || 5000

app.get("/api/protected", requireAuth, (req, res) => {
    console.log(req.user,"user")
    return res.json({ message: "Protected route", user: req.user });
  });

app.use('/api/user', userRouter);

mongoConnect().then(()=>{
    try {
        app.listen(port, ()=>{
            console.log("Server listening on port", port)
        })
    } catch (error) {
        console.log("Error listening to port", error)
    }
})