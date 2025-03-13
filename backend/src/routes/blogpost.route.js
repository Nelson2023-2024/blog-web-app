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

//fetch all blogs
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            profilePic: true,
          },
        },
        _count: {
          select: { likes: true }, // Returns the count of likes
        },
      },
      orderBy: { createdAt: "desc" }, // Sort by most recent blogs first
    });

    if (!blogs || blogs.length === 0)
      return res.status(404).json({ error: "No blogs at the moment" });

    return res.status(200).json(blogs);
  } catch (error) {
    console.log("Error in get-blogs controller", error.message);
    res.status(500).json({ error: error.message });
  }
});
export { router as blogPostRoute };
