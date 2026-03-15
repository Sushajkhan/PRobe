import { Router, Request, Response } from "express";
import webhookRouter from "./webhook.routes";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/webhook", webhookRouter);

export default router;
