import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Wallet } from "../entities/Wallet";
import { User } from "../entities/User";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";


export const createWallet = async (req: Request, res: Response) => {
  const { id, name, balance } = req.body;
  // const userId = req.user.id;

  try {
    const userRepository = getRepository(User);
    // const user = await userRepository.findOne(userId);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const walletRepository = getRepository(Wallet);
    const newWallet = walletRepository.create({ name, balance, user });
    await walletRepository.save(newWallet);

    return res.status(201).json({ message: "Wallet created successfully.", wallet: newWallet });
  } catch (error) {
    console.error("Create wallet error:", error);
    res.status(500).json({ message: "An error occurred while creating the wallet." });
  }
};


export const getWalletById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const walletRepository = getRepository(Wallet);
    const wallet = await walletRepository.findOne({ where: { id: parseInt(id) } });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    return res.status(200).json({ wallet });
  } catch (error) {
    console.error("Get wallet by ID error:", error);
    res.status(500).json({ message: "An error occurred while fetching the wallet." });
  }
};


export const getUserAndWallet = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    // console.log("==user==");
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const walletRepository = getRepository(Wallet);
    const wallet = await walletRepository.findOne({ where: { user: { id: userId } } });

    // console.log("==wallet==");
    // console.log(wallet);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for the user' });
    }

    return res.status(200).json({ user, wallet });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "An error occurred while fetching the user and wallet." });
  }
};

export const depositFunds = async (req: AuthenticatedRequest, res: Response) => {
  const { amount } = req.body;
  const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
  try {
    // Get the user's wallet from the database
    const walletRepository = getRepository(Wallet);
    const userWallet = await walletRepository.findOne({ where: { user: { id: userId } } });

    if (!userWallet) {
      return res.status(404).json({ message: 'Wallet not found for the user' });
    }

    // Update the wallet balance by adding the deposited amount
    userWallet.balance += amount;

    // Save the updated wallet to the database
    await walletRepository.save(userWallet);

    // Respond with the updated wallet
    return res.status(200).json(userWallet);
  } catch (error) {
    console.error('Error while depositing to wallet:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const transferFunds = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id; 
  const { fromWalletId, toWalletId, amount } = req.body;
  try {
    if (fromWalletId === toWalletId) {
      return res.status(404).json({ message: "You cannot transfer from your wallet to your wallet" });
    }

    // Get the sender's wallet from the database
    const walletRepository = getRepository(Wallet);
    const fromWallet = await walletRepository.findOne({
      where: { id: fromWalletId, user: { id: userId } },
    });

    if (!fromWallet) {
      return res.status(404).json({ message: "Sender's wallet not found" });
    }

    // Check if the sender has sufficient balance for the transfer
    if (fromWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance for the transfer" });
    }

    // Get the receiver's wallet from the database
    const toWallet = await walletRepository.findOne({
      where: { id: toWalletId },
    });

    if (!toWallet) {
      return res.status(404).json({ message: "Receiver's wallet not found" });
    }

    // Perform the transfer: deduct the amount from the sender's wallet and add it to the receiver's wallet
    fromWallet.balance -= amount;
    toWallet.balance += amount;

    // Save the updated wallets to the database
    await walletRepository.save([fromWallet, toWallet]);

    // Respond with a success message
    return res.status(200).json({ message: "Funds transferred successfully" });
  } catch (error) {
    console.error("Error while transferring funds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const withdrawFunds = async (req: AuthenticatedRequest, res: Response) => {
  const { amount } = req.body;
  const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user

  try {
    // Get the user's wallet from the database
    const walletRepository = getRepository(Wallet);
    const userWallet = await walletRepository.findOne({ where: { user: { id: userId } } });

    if (!userWallet) {
      return res.status(404).json({ message: "Wallet not found for the user" });
    }

    // Check if the user has sufficient balance for withdrawal
    if (userWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update the wallet balance by deducting the withdrawn amount
    userWallet.balance -= amount;

    // Save the updated wallet to the database
    await walletRepository.save(userWallet);

    // Respond with the updated wallet
    return res.status(200).json(userWallet);
  } catch (error) {
    console.error("Error while withdrawing funds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
