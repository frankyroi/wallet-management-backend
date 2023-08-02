"use strict";
// wallet-management-backend/src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const authRoutes_1 = require("./routes/authRoutes");
const walletRoutes_1 = require("./routes/walletRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const cors_1 = __importDefault(require("cors"));
// const app: Application = express();
const app = (0, express_1.default)();
// Middlewares and body-parser setup (if needed)
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Custom middleware to apply `authenticateUser` to specific routes
const applyAuthMiddlewareToRoutes = (req, res, next) => {
    // Apply authenticateUser middleware for /api/wallet and /api/user routes
    if (req.path.startsWith("/api/wallet") || req.path.startsWith("/api/user")) {
        (0, authMiddleware_1.authenticateUser)(req, res, next);
    }
    else {
        next();
    }
};
(0, typeorm_1.createConnection)()
    .then(() => {
    console.log("Connected to the database.");
    // Apply custom middleware to /api/wallets and /api/users routes
    app.use(applyAuthMiddlewareToRoutes);
    // Apply other routes without authentication middleware
    app.use("/api/auth", authRoutes_1.AuthRoutes);
    // Apply routes
    app.use("/api/wallet", walletRoutes_1.WalletRoutes);
    app.use("/api/user", userRoutes_1.UserRoutes);
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
        console.log(`Server started on port ${port}.`);
    });
})
    .catch((error) => console.error("Database connection error:", error));
