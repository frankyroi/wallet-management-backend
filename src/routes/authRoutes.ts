import { Router } from "express";
import { login, signup, acceptInvitation } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.put("/acceptInvitation", acceptInvitation);

export const AuthRoutes = router;
