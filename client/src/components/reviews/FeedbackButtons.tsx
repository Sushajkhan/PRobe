"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFeedback } from "@/hooks/useReviews";

interface FeedbackButtonsProps {
  reviewId: string;
  userFeedback: boolean | null;
}

export function FeedbackButtons({
  reviewId,
  userFeedback,
}: FeedbackButtonsProps) {
  const { mutate: submitFeedback, isPending } = useFeedback(reviewId);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Was this review helpful?
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 gap-2 h-8 text-xs",
            userFeedback === true &&
              "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
          )}
          disabled={isPending}
          onClick={() => submitFeedback(true)}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 gap-2 h-8 text-xs",
            userFeedback === false &&
              "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20",
          )}
          disabled={isPending}
          onClick={() => submitFeedback(false)}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          Not helpful
        </Button>
      </div>
    </div>
  );
}
