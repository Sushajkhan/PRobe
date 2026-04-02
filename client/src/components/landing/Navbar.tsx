"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "../icons/Logo";

export function Navbar() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-8 w-8" />

            <span className="text-sm font-bold tracking-tight">PRobe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              size="sm"
              className="text-[13px] font-medium px-4 h-9"
            >
              Log in
            </Button>
          </Link>

          <Link href="/sign-in">
            <Button
              size="sm"
              className="h-9 rounded-md text-[13px] font-semibold px-5"
            >
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
