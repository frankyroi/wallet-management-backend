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
exports.WalletRoutes = void 0;
const express_1 = require("express");
const walletController_1 = require("../controllers/walletController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", walletController_1.getAllWallets);
router.post("/", walletController_1.createWallet);
router.put("/:id", walletController_1.updateWallet);
router.delete("/:id", walletController_1.deleteWallet);
router.get("/data/:id", walletController_1.getWalletById);
router.post("/deposit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, authMiddleware_1.isAuthRequest)(req)) {
        yield (0, walletController_1.depositFunds)(req, res);
    }
    else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
}));
router.get("/getUserAndWalletData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, authMiddleware_1.isAuthRequest)(req)) {
        yield (0, walletController_1.getUserAndWallet)(req, res);
    }
    else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
}));
router.post("/transfer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, authMiddleware_1.isAuthRequest)(req)) {
        yield (0, walletController_1.transferFunds)(req, res);
    }
    else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
}));
router.post("/withdraw", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, authMiddleware_1.isAuthRequest)(req)) {
        yield (0, walletController_1.withdrawFunds)(req, res);
    }
    else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
}));
exports.WalletRoutes = router;
