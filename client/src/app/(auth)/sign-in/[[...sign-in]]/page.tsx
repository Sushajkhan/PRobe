"use client";

import { Logo } from "@/components/icons/Logo";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo className="h-12 w-12" />
            <span className="text-base font-semibold tracking-tight">
              PRobe
            </span>
          </Link>

          <h1 className="text-xl font-semibold tracking-tight">
            AI-powered code reviews for your PRs
          </h1>

          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to get instant insights on security,
            performance, and code quality
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              footerAction: { display: "none" },
            },
          }}
        />
      </div>
    </div>
  );
}
