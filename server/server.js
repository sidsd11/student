import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import connectDB from './config/connectDB.js'
import userRouter from './routes/userRoutes.js'
import studentRouter from './routes/studentRoutes.js'

const app = express()
const port = process.env.PORT || 5000

await connectDB()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

app.get('/', (req, res) => {
    res.send('API working')
})

app.use('/api/user', userRouter)
app.use('/api/student', studentRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})