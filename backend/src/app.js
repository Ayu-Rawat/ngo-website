import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))

// Routes Import

import healthcheckRouter from "./routes/healthcheck.routes.js"

// Routes Declaration
app.use("/api/v1/healthcheck",healthcheckRouter)

export {app}