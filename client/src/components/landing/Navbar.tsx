"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "../icons/Logo";

export function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 py-3 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className="h-14 flex items-center justify-between px-6 rounded-2xl
            border border-border/50 bg-background/70 backdrop-blur-xl
            shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_4px_16px_0_rgb(0_0_0/0.04)]"
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Logo className="h-8 w-8" />
              <span className="text-sm font-bold tracking-tight">PRobe</span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-muted-foreground">
              <a
                href="#features"
                className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-all"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-all"
              >
                How it works
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="text-[13px] font-medium px-4 h-9 rounded-xl"
              >
                Log in
              </Button>
            </Link>

            <Link href="/sign-in">
              <Button
                size="sm"
                className="h-9 rounded-xl text-[13px] font-semibold px-5
                  bg-gradient-to-b from-primary to-primary/90
                  shadow-[0_1px_2px_0_rgb(0_0_0/0.1),inset_0_1px_0_0_rgb(255_255_255/0.12)]
                  hover:shadow-[0_2px_8px_0_rgb(0_0_0/0.12),inset_0_1px_0_0_rgb(255_255_255/0.12)]
                  transition-all duration-200 hover:brightness-110"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
