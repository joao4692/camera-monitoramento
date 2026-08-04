import { Router } from "express";
import { loginController, meController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/auth/login", loginController);
router.get("/auth/me", authMiddleware, meController);

export default router;
