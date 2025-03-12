import { Router } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../config/prismaConfig.js";
import bcrypt from "bcrypt";
import { generateJWTAndSetCookie } from "../../utils/createJWTAndSetCookie.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .isStrongPassword()
      .withMessage("The password you entered is not a strong password"),
  ],
  async (req, res) => {
    const { email, fullName, userName, password, confirmPassword } = req.body;

    try {
      //ensure all fields are not null
      if (!email || !fullName || !userName || !password || !confirmPassword)
        return res.status(400).json({ error: "All fields are required" });

      //Confirm if password match
      if (password !== confirmPassword)
        return res.status(400).json({ error: "Passwords did not match" });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({ error: errors.array().map((err) => err.msg) });

      //check if the username and email exists in the DB
      const [existingEmail, existingUserName] = await Promise.all([
        prisma.user.findFirst({ where: { email } }),
        prisma.user.findFirst({ where: { userName } }),
      ]);

      if (existingEmail)
        return res.status(400).json({ error: "Email is already in use" });

      if (existingUserName)
        return res.status(400).json({ error: "Username is already taken" });

      //hashPasword
      const hashedPassword = await bcrypt.hash(password, 10);

      //Add the user to the DB
      const user = await prisma.user.create({
        data: {
          email,
          fullName,
          password: hashedPassword,
          userName,
        },
      });

      //generate JWT
      await generateJWTAndSetCookie(user.id, res);

      return res.status(201).json({ user, message: "Signup successfully" });
    } catch (error) {
      console.error("An error occurred in signup controller", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post("/login", async (req, res) => {});

export { router as authRoutes };
