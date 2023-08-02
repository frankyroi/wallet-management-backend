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
exports.toggleUser = exports.getUserById = exports.getAllUsers = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
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
