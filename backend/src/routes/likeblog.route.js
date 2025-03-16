import { Router } from "express";
import { protectRoute } from "../../middleware/protectRoute.js";
import { prisma } from "../../config/prismaConfig.js";

const router = Router();

router.use(protectRoute);

router.post("/:id", async (req, res) => {
  const { id: blogId } = req.params;

  const { id: userId } = req.user;
  try {
    const blogPost = await prisma.post.findUnique({ where: { id: blogId } });
    if (!blogPost)
      return res.status(404).json({ success: false, error: "Blog not found" });

    // composite unique key is a database concept where multiple columns (fields) are combined to form a unique identifier for a record in a table. Unlike a single-column unique key (like a primary key id), a composite unique key ensures that the combination of values in the specified columns is unique across the table.
    //if the blog is found check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        //composite key
        userId_postId: { userId: userId, postId: blogId },
      },
    });
    if (existingLike) {
      // Unlike the post if user has already likes
      await prisma.like.delete({
        where: {
          userId_postId: { userId: userId, postId: blogId },
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Blog unliked successfully" });
    } else {
      //if the user has not liked the post
      const newLike = await prisma.like.create({
        data: { userId, postId: blogId },
      });
      return res.status(200).json({
        success: true,
        message: "Blog liked successfully",
        data: newLike,
      });
    }
  } catch (error) {
    console.error("Error liking blog:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

export { router as likeBlogRoute };
