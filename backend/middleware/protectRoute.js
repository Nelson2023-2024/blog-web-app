import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaConfig";
export const protectRoute = async (req, res, next) => {
  try {
    //retrieve token from cookies
    const token = req.cookies.jwt;

    if (!token)
      return res.status(401).json({ error: "Unauthorized no token provided" });

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });

    //find the user in the DB
    const user = await prisma.user.findFirst({ where: { id: decoded.userId } });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found for authentication" });

    //if the user is found
    req.user = user;
    next();
  } catch (error) {}
};
