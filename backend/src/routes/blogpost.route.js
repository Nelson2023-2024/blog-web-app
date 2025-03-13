import { Router } from "express";
import { protectRoute } from "../../middleware/protectRoute.js";
import { error } from "console";
import { prisma } from "../../config/prismaConfig.js";
import cloudinary from "../../config/cloudinaryConfig.js";

const router = Router();

router.use(protectRoute);

//creating a blogpost
router.post("/create-blog", async (req, res) => {
  const { title, content, featuredImg } = req.body;

  const { id } = req.user;

  try {
    if (!title || !content)
      return res.status(400).json({ error: "All fields are required" });

    //chack if user is passing an image or not
    let imageUrl;

    //if  the image is set
    if (featuredImg) {
      const uploadImage = await cloudinary.uploader.upload(featuredImg);
      console.log("uploadImage", uploadImage);
      imageUrl = uploadImage.secure_url;
    }

    const blog = await prisma.post.create({
      data: { title, content, authorId: id, featuredImg: imageUrl },
    });

    if (blog)
      return res
        .status(201)
        .json({ message: "Blog create successfully", data: blog });
  } catch (error) {
    console.log("Error in create-blog controller", error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as blogPostRoute };
