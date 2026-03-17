import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  listReviews,
  getReview,
  deleteReview,
  submitFeedback,
} from "../controllers/review.controller";

const router = Router();

router.get("/", requireAuth(), listReviews);
router.get("/:id", requireAuth(), getReview);
router.delete("/:id", requireAuth(), deleteReview);
router.post("/:id/feedback", requireAuth(), submitFeedback);

export default router;
