import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { connectGithub, getUser } from "../controllers/auth.controller";

const router = Router();

router.post("/connect-github", requireAuth(), connectGithub);

router.get("/user", requireAuth(), getUser);

export default router;
