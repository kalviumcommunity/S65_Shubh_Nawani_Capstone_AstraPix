const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const userRoute = require('./routers/userRoute')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const uploadRoute = require('./routers/upload')
const creditRoute = require('./routers/creditRoute')

const app = express()
dotenv.config()

app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.use("/api", userRoute)
app.use("/v1", uploadRoute)
app.use("/check", creditRoute)

app.get("/", (req, res) => {
    try {
        return res.status(200).json({message: "Backend is running..."})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

const PORT = process.env.PORT || 4000

app.listen(PORT, async () => {
    try {
        await connectDB()
        console.log(`Server is listening on http://localhost:${PORT}`)
    } catch (err) {
        console.error(err.message)
    }
})