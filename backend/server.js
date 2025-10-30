import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/db.js'
import { adminRouter } from './routes/adminRouter.js'
import { authRouter } from './routes/authRoutes.js'
import { codeShareRouter } from './routes/codeShareRouter.js'
import { contestRouter } from './routes/contestRouter.js'
import { problemRouter } from './routes/problemRouter.js'
import { submissionRouter } from './routes/submissionRouter.js'

dotenv.config()

const app = express()
const port = 3000 

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/problems',problemRouter)
app.use('/api/v1/contests',contestRouter)
app.use('/api/v1/codeShare',codeShareRouter)
app.use('/api/v1/submission', submissionRouter)
app.use('/api/v1/admin', adminRouter)

connectDB()


app.get('/',(req,res)=>{
  res.send("YEEE")
})

app.listen(port, () => {
  console.log(`server running at port ${port}`)
})