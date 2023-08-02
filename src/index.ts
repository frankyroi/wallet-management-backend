// wallet-management-backend/src/index.ts

import express, { Application, Request, Response, NextFunction } from "express";
import { createConnection } from "typeorm";
import { AuthRoutes } from "./routes/authRoutes";
import { WalletRoutes } from "./routes/walletRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { authenticateUser, AuthenticatedRequest } from "./middlewares/authMiddleware";
import cors from "cors"; 

// const app: Application = express();
const app = express();

// Middlewares and body-parser setup (if needed)
app.use(express.json());

app.use(cors());

// Custom middleware to apply `authenticateUser` to specific routes
const applyAuthMiddlewareToRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Apply authenticateUser middleware for /api/wallet and /api/user routes
  if (req.path.startsWith("/api/wallet") || req.path.startsWith("/api/user")) {
    authenticateUser(req as AuthenticatedRequest, res, next);
  } else {
    next();
  }
};

createConnection()
  .then(() => {
    console.log("Connected to the database.");

    // Apply custom middleware to /api/wallets and /api/users routes
    app.use(applyAuthMiddlewareToRoutes);

    // Apply other routes without authentication middleware
    app.use("/api/auth", AuthRoutes);

    // Apply routes
    app.use("/api/wallet", WalletRoutes);
    app.use("/api/user", UserRoutes);

    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`Server started on port ${port}.`);
    });
  })
  .catch((error) => console.error("Database connection error:", error));
