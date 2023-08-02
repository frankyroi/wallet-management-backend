// src/controllers/userController.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Generate a random password of a given length
const generateRandomPassword = (length: number) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
  
    return password;
};

export const inviteUser = async (req: Request, res: Response) => {
  const { email, isAdmin } = req.body;

  try {
    const userRepository = getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const password = generateRandomPassword(10); // You can implement your own password generation logic

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({ email, password: hashedPassword, isAdmin });
    await userRepository.save(newUser);

    // Send invitation email with the generated password

    return res.status(200).json({ message: "User invited successfully." });
  } catch (error) {
    console.error("Invite user error:", error);
    res.status(500).json({ message: "An error occurred while inviting the user." });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "An error occurred while fetching the users." });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "An error occurred while fetching the user." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, isAdmin } = req.body;

  try {
    const userRepository = getRepository(User);
    // const user = await userRepository.findOne(id);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.email = email;
    user.isAdmin = isAdmin;
    await userRepository.save(user);

    return res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "An error occurred while updating the user." });
  }
};

export const toggleUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const userRepository = getRepository(User);
    // const user = await userRepository.findOne(id);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isActive = !user.isActive;
    await userRepository.save(user);

    return res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Toggle user error:", error);
    res.status(500).json({ message: "An error occurred while toggling the user." });
  }
};

