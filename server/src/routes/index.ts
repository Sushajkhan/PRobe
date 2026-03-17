import { Router, Request, Response } from "express";
import webhookRouter from "./webhook.routes";
import authRouter from "./auth.routes";
import repoRouter from "./repo.routes";
import reviewRouter from "./review.routes";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/webhook", webhookRouter);
router.use("/auth", authRouter);
router.use("/repos", repoRouter);
router.use("/reviews", reviewRouter);

export default router;
