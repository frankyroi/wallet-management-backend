import { Router, Request } from "express";
import { createWallet, getUserAndWallet, depositFunds, transferFunds, withdrawFunds, getWalletById } from "../controllers/walletController";
import { isAuthRequest } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", createWallet);
router.get("/data/:id", getWalletById);

router.post("/deposit", async (req: Request, res) => {
    if (isAuthRequest(req)) {
        await depositFunds(req, res);
      } else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
      }
});

router.get("/getUserAndWalletData", async (req: Request, res) => {
    if (isAuthRequest(req)) {
        await getUserAndWallet(req, res);
      } else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
      }
});

router.post("/transfer", async (req: Request, res) => {
    if (isAuthRequest(req)) {
        await transferFunds(req, res);
      } else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
      }
});

router.post("/withdraw", async (req: Request, res) => {
    if (isAuthRequest(req)) {
        await withdrawFunds(req, res);
    } else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
});


export const WalletRoutes = router;
