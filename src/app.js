import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "https://plantalife.vercel.app",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import treeRouter from './routes/tree.routes.js'
import userRouter from "./routes/user.routes.js"
import transactionRouter from "./routes/transaction.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/trees", treeRouter)
app.use("/api/v1/transactions", transactionRouter)

// http://localhost:8000/api/v1/users/register

export { app }