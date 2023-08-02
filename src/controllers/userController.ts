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

