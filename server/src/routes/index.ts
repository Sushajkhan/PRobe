import { Router, Request, Response } from "express";
import webhookRouter from "./webhook.routes";
import authRouter from "./auth.routes";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/webhook", webhookRouter);
router.use("/auth", authRouter);

export default router;
