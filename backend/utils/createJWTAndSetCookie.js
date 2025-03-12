import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
configDotenv();

export const generateJWTAndSetCookie = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error("An error occurred in generateJWTAndSetCookie function", error);
    return res.status(500).json({ error: error.message });
}

};
