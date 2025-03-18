import express from "express";
import { configDotenv } from "dotenv";
import { authRoutes } from "./routes/auth.route.js";
import { blogPostRoute } from "./routes/blogpost.route.js";
import cookieParser from "cookie-parser";
import { likeBlogRoute } from "./routes/likeblog.route.js";

configDotenv();

const app = express();

app.use(express.json({ limit: "5gb" })); // Set max payload size to 5GB
app.use(express.urlencoded({ limit: "5gb", extended: true })); // Handle large form data
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogPostRoute);
app.use("/api/like-blog", likeBlogRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
