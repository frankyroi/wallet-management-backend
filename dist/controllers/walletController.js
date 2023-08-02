"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawFunds = exports.transferFunds = exports.depositFunds = exports.getUserAndWallet = exports.deleteWallet = exports.updateWallet = exports.getWalletById = exports.getAllWallets = exports.createWallet = void 0;
const typeorm_1 = require("typeorm");
const Wallet_1 = require("../entities/Wallet");
const User_1 = require("../entities/User");
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, balance } = req.body;
    // const userId = req.user.id;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // const user = await userRepository.findOne(userId);
        const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const newWallet = walletRepository.create({ name, balance, user });
        yield walletRepository.save(newWallet);
        return res.status(201).json({ message: "Wallet created successfully.", wallet: newWallet });
    }
    catch (error) {
        console.error("Create wallet error:", error);
        res.status(500).json({ message: "An error occurred while creating the wallet." });
    }
});
exports.createWallet = createWallet;
const getAllWallets = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const wallets = yield walletRepository.find();
        return res.status(200).json({ wallets });
    }
    catch (error) {
        console.error("Get all wallets error:", error);
        res.status(500).json({ message: "An error occurred while fetching the wallets." });
    }
});
exports.getAllWallets = getAllWallets;
const getWalletById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const wallet = yield walletRepository.findOne({ where: { id: parseInt(id) } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found." });
        }
        return res.status(200).json({ wallet });
    }
    catch (error) {
        console.error("Get wallet by ID error:", error);
        res.status(500).json({ message: "An error occurred while fetching the wallet." });
    }
});
exports.getWalletById = getWalletById;
const updateWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, balance } = req.body;
    try {
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        // const wallet = await walletRepository.findOne(id);
        const wallet = yield walletRepository.findOne({ where: { id: parseInt(id) } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found." });
        }
        wallet.name = name;
        wallet.balance = balance;
        yield walletRepository.save(wallet);
        return res.status(200).json({ message: "Wallet updated successfully.", wallet });
    }
    catch (error) {
        console.error("Update wallet error:", error);
        res.status(500).json({ message: "An error occurred while updating the wallet." });
    }
});
exports.updateWallet = updateWallet;
const deleteWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        // const wallet = await walletRepository.findOne(id);
        const wallet = yield walletRepository.findOne({ where: { id: parseInt(id) } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found." });
        }
        yield walletRepository.remove(wallet);
        return res.status(200).json({ message: "Wallet deleted successfully." });
    }
    catch (error) {
        console.error("Delete wallet error:", error);
        res.status(500).json({ message: "An error occurred while deleting the wallet." });
    }
});
exports.deleteWallet = deleteWallet;
const getUserAndWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        // console.log("==user==");
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const wallet = yield walletRepository.findOne({ where: { user: { id: userId } } });
        // console.log("==wallet==");
        // console.log(wallet);
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for the user' });
        }
        return res.status(200).json({ user, wallet });
    }
    catch (error) {
        console.error("Get user by ID error:", error);
        res.status(500).json({ message: "An error occurred while fetching the user and wallet." });
    }
});
exports.getUserAndWallet = getUserAndWallet;
const depositFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
    try {
        // Get the user's wallet from the database
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const userWallet = yield walletRepository.findOne({ where: { user: { id: userId } } });
        if (!userWallet) {
            return res.status(404).json({ message: 'Wallet not found for the user' });
        }
        // Update the wallet balance by adding the deposited amount
        userWallet.balance += amount;
        // Save the updated wallet to the database
        yield walletRepository.save(userWallet);
        // Respond with the updated wallet
        return res.status(200).json(userWallet);
    }
    catch (error) {
        console.error('Error while depositing to wallet:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.depositFunds = depositFunds;
const transferFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { fromWalletId, toWalletId, amount } = req.body;
    try {
        if (fromWalletId === toWalletId) {
            return res.status(404).json({ message: "You cannot transfer from your wallet to your wallet" });
        }
        // Get the sender's wallet from the database
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const fromWallet = yield walletRepository.findOne({
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
        const toWallet = yield walletRepository.findOne({
            where: { id: toWalletId },
        });
        if (!toWallet) {
            return res.status(404).json({ message: "Receiver's wallet not found" });
        }
        // Perform the transfer: deduct the amount from the sender's wallet and add it to the receiver's wallet
        fromWallet.balance -= amount;
        toWallet.balance += amount;
        // Save the updated wallets to the database
        yield walletRepository.save([fromWallet, toWallet]);
        // Respond with a success message
        return res.status(200).json({ message: "Funds transferred successfully" });
    }
    catch (error) {
        console.error("Error while transferring funds:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.transferFunds = transferFunds;
const withdrawFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
    try {
        // Get the user's wallet from the database
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const userWallet = yield walletRepository.findOne({ where: { user: { id: userId } } });
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
        yield walletRepository.save(userWallet);
        // Respond with the updated wallet
        return res.status(200).json(userWallet);
    }
    catch (error) {
        console.error("Error while withdrawing funds:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.withdrawFunds = withdrawFunds;
