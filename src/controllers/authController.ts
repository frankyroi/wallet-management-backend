import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { Wallet } from "../entities/Wallet";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const generateAccessToken = (id: number, isAdmin: boolean) => {
  const expiresIn = "1h"; // Token expiration time (you can adjust this as needed)
  const secretKey = "secret-key"; // Replace with your own secret key for token signing
  return jwt.sign({ id, isAdmin }, secretKey, { expiresIn });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.isActive) {
      if (user.invitationToken) {
        return res.status(401).json({ message: "User needs to accept invitation." });
      } else {
        return res.status(401).json({ message: "Account is disabled." });
      }
      
    }

    const accessToken = generateAccessToken(user.id, user.isAdmin);

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};


export const signup = async (req: Request, res: Response) => {
  const { name, email, password, isAdmin } = req.body;
  const token = uuidv4(); // Generate a unique token

  try {
    // Check if the user already exists
    const userRepository = getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entity
    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      invitationToken: token,
      isAdmin,
    });

    // Save the user to the database
    const user = await userRepository.save(newUser);


    const walletRepository = getRepository(Wallet);
    const newWallet = walletRepository.create({
      name, 
      balance: 0, 
      user
    });

    await walletRepository.save(newWallet);

    // Respond with a success message
    return res.status(201).json({ message: 'User created successfully', userData: user });
  } catch (error) {
    console.error('Error while signing up:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const acceptInvitation = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // Find the user with the provided token
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: {invitationToken: token} });

    if (!user) {
      return res.status(404).json({ message: "Invalid token or user not found." });
    }

    // Mark the user as "active"
    user.isActive = true;
    user.invitationToken = ""; // Clear the invitation token
    await userRepository.save(user);

    return res.status(200).json({ message: "Invitation accepted successfully." });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ error: "Error accepting invitation." });
  }
};
