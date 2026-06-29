// importing from buitin packages/modules
import url from "url"
import path from "path"

// importing from installed packages
import express from "express"
import session from "express-session"
import cors from "cors"

// importing from custom modules
import logger from "./middlewares/logger.js"
import productRoutes from "./routes/productRoutes.js"
import login from "./routes/login.js"
import requireAuth from "./middlewares/requireAuth.js"
import authStatus from "./routes/authStatus.js"
import notFound from "./middlewares/notFound.js"
import errorHandler from "./middlewares/errorHandler.js"
import { connectDB } from "./config/db.js"

const app = express()
const port = process.env.PORT || 5000

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
await connectDB()

//
app.use(cors())

// json middleware
app.use(express.json())

// urlencoded middleware for form data paring
app.use(express.urlencoded({extended : false}))

// session middleware
app.use(session({
    "secret" : "mysecret",
    resave : false,
    saveUninitialized : false
}))

// logger middleware
app.use(logger)

// static middleware for serving static files
app.use(express.static(path.join(__dirname, "../public")))

// login middleware
app.use("/login", login)

app.use("/auth/status", authStatus)

// route Mounting
app.use("/api/products", requireAuth, productRoutes)

// notFound middleware
app.use(notFound)

// errorHandler middleware
app.use(errorHandler)

// starting app/server
app.listen(port, () => console.log(`Server running on port: ${port}`))
