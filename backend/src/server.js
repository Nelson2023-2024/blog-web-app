import express from "express"
import {configDotenv} from "dotenv"
import { authRoutes } from "./routes/auth.route.js"
import { blogPostRoute } from "./routes/blogpost.route.js"

configDotenv()

const app = express()


app.use(express.json())
const PORT = process.env.PORT

app.use("/api/auth", authRoutes)
app.use("/api/blog", blogPostRoute)

app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}/`);
})
