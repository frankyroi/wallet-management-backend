"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.isAuthRequest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthRequest = (req) => {
    return 'user' in req;
};
exports.isAuthRequest = isAuthRequest;
const authenticateUser = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "No authentication token. Access denied." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "secret-key");
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid authentication token. Access denied." });
    }
};
exports.authenticateUser = authenticateUser;
