import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
configDotenv();

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
