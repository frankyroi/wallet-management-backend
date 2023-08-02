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
exports.toggleUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.inviteUser = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Generate a random password of a given length
const generateRandomPassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, isAdmin } = req.body;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const password = generateRandomPassword(10); // You can implement your own password generation logic
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = userRepository.create({ email, password: hashedPassword, isAdmin });
        yield userRepository.save(newUser);
        // Send invitation email with the generated password
        return res.status(200).json({ message: "User invited successfully." });
    }
    catch (error) {
        console.error("Invite user error:", error);
        res.status(500).json({ message: "An error occurred while inviting the user." });
    }
});
exports.inviteUser = inviteUser;
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const users = yield userRepository.find();
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "An error occurred while fetching the users." });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Get user by ID error:", error);
        res.status(500).json({ message: "An error occurred while fetching the user." });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, isAdmin } = req.body;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // const user = await userRepository.findOne(id);
        const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.email = email;
        user.isAdmin = isAdmin;
        yield userRepository.save(user);
        return res.status(200).json({ message: "User updated successfully.", user });
    }
    catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "An error occurred while updating the user." });
    }
});
exports.updateUser = updateUser;
const toggleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // const user = await userRepository.findOne(id);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.isActive = !user.isActive;
        yield userRepository.save(user);
        return res.status(200).json({ message: "User updated successfully.", user });
    }
    catch (error) {
        console.error("Toggle user error:", error);
        res.status(500).json({ message: "An error occurred while toggling the user." });
    }
});
exports.toggleUser = toggleUser;
