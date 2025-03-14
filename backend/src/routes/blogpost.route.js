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

//get specific blog-post via ID
router.get("/get-blog/:id", async (req, res) => {
  const { id: blogId } = req.params;
  try {
    const blog = await prisma.post.findUnique({
      where: { id: blogId },
      select: {
        author: true,
        content: true,
        createdAt: true,
        title: true,
        featuredImg: true,
        likes: true,
        id: true,
        _count: true,
      },
    });

    if (!blog)
      return res.status(404).json({ error: "Blog not found", success: false });

    //if the blog if found
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.log("Error in /get-blog/:id controller", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-blog/:id", async (req, res) => {
  const { id: blogId } = req.params;
  const { title, content, featuredImg } = req.body;

  try {
    // Check if the blog exists
    const blogPost = await prisma.post.findUnique({ where: { id: blogId } });
    if (!blogPost) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    // Prepare the update data
    let updatedFeaturedImg = blogPost.featuredImg;

    // If a new featuredImg is provided, upload it and get the new URL
    if (featuredImg) {
      const uploadImage = await cloudinary.uploader.upload(featuredImg);
      updatedFeaturedImg = uploadImage.secure_url;
    }

    // Update the blog post
    const updatedBlog = await prisma.post.update({
      where: { id: blogId },
      data: {
        title: title || blogPost.title,
        content: content || blogPost.content,
        featuredImg: updatedFeaturedImg,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

router.delete("/delete-blog/:id", async (req, res) => {
  const { id: blogId } = req.params;

  try {
    //check if it exists in the DB
    let blogPost = await prisma.post.findFirst({ where: { id: blogId } });

    if (!blogPost)
      return res.status(404).json({ success: false, error: "Blog not found" });

    // Delete the blog post
    const deletedBlog = await prisma.post.delete({ where: { id: blogId } });

    // Return a success response with the deleted blog details
    return res.status(200).json({
      success: true,
      data: deletedBlog,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});
export { router as blogPostRoute };
