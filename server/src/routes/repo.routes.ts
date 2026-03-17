import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  listGithubRepos,
  listConnectedRepos,
  connectRepo,
  toggleRepo,
  disconnectRepo,
} from "../controllers/repo.controller";
import { listRepoReviews } from "../controllers/review.controller";

const router = Router();

router.get("/", requireAuth(), listGithubRepos);
router.get("/connected", requireAuth(), listConnectedRepos);
router.post("/connect", requireAuth(), connectRepo);
router.patch("/:id/toggle", requireAuth(), toggleRepo);
router.delete("/:id", requireAuth(), disconnectRepo);
router.get("/:repoId/reviews", requireAuth(), listRepoReviews);

export default router;
