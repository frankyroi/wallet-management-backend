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
exports.UserRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", userController_1.getAllUsers);
router.get("/:id", userController_1.getUserById);
router.put("/toggle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, authMiddleware_1.isAuthRequest)(req)) {
        yield (0, userController_1.toggleUser)(req, res);
    }
    else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
}));
exports.UserRoutes = router;
