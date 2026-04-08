import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getOverview,
  getRepoAnalytics,
  getTopFindings,
} from "../controllers/analytics.controller";

const router = Router();

router.get("/overview", requireAuth(), getOverview);
router.get("/repos", requireAuth(), getRepoAnalytics);
router.get("/findings", requireAuth(), getTopFindings);

export default router;
