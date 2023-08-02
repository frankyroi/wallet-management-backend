import { Router, Request } from "express";
import { inviteUser, getAllUsers, getUserById, toggleUser } from "../controllers/userController";
import { isAuthRequest } from "../middlewares/authMiddleware";

const router = Router();

router.post("/invite", inviteUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.put("/toggle", async (req: Request, res) => {
    if (isAuthRequest(req)) {
        await toggleUser(req, res);
    } else {
        res.status(401).json({ message: 'No authentication token. Access denied.' });
    }
});
export const UserRoutes = router;
