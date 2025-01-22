import { hashPassword } from "../config/hashpassword.config.js";
import User from "../models/user.model.js";
import { randomBytes, randomInt } from "crypto";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = await hashPassword(password, salt);

    // Create new user
    const user = new User({
      name,
      avatar: `https://api.dicebear.com/8.x/notionists/svg?seed=${name}`,
      username: `@${name}${randomInt(0, 10000)}`,
      email,
      password: hashedPassword,
      salt,
    });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User no exists with this email." });
  }

  const hashedPassword = await hashPassword(password, user.salt);
  if (hashedPassword === user.password) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res.status(201).json({
      token,
      _id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      message: "Login successful",
    });
  } else {
    res.status(500).json("Invalid email or password");
  }
};
