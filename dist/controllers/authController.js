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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvitation = exports.signup = exports.login = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Wallet_1 = require("../entities/Wallet");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const generateAccessToken = (id, isAdmin) => {
    const expiresIn = "1h"; // Token expiration time (you can adjust this as needed)
    const secretKey = "secret-key"; // Replace with your own secret key for token signing
    return jsonwebtoken_1.default.sign({ id, isAdmin }, secretKey, { expiresIn });
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        if (!user.isActive) {
            if (user.invitationToken) {
                return res.status(401).json({ message: "User needs to accept invitation." });
            }
            else {
                return res.status(401).json({ message: "Account is disabled." });
            }
        }
        const accessToken = generateAccessToken(user.id, user.isAdmin);
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login." });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, isAdmin } = req.body;
    const token = (0, uuid_1.v4)(); // Generate a unique token
    try {
        // Check if the user already exists
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Hash the password before saving to the database
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new user entity
        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            invitationToken: token,
            isAdmin,
        });
        // Save the user to the database
        const user = yield userRepository.save(newUser);
        const walletRepository = (0, typeorm_1.getRepository)(Wallet_1.Wallet);
        const newWallet = walletRepository.create({
            name,
            balance: 0,
            user
        });
        yield walletRepository.save(newWallet);
        // Respond with a success message
        return res.status(201).json({ message: 'User created successfully', userData: user });
    }
    catch (error) {
        console.error('Error while signing up:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signup = signup;
const acceptInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        // Find the user with the provided token
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { invitationToken: token } });
        if (!user) {
            return res.status(404).json({ message: "Invalid token or user not found." });
        }
        // Mark the user as "active"
        user.isActive = true;
        user.invitationToken = ""; // Clear the invitation token
        yield userRepository.save(user);
        return res.status(200).json({ message: "Invitation accepted successfully." });
    }
    catch (error) {
        console.error("Error accepting invitation:", error);
        return res.status(500).json({ error: "Error accepting invitation." });
    }
});
exports.acceptInvitation = acceptInvitation;
