"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-36 pb-28 text-center max-w-4xl mx-auto relative">
      <div
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full
          border border-primary/20 bg-primary/[0.06] backdrop-blur-sm
          text-xs text-muted-foreground mb-10
          hover:bg-primary/[0.1] hover:border-primary/30 transition-all duration-300
          cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-700"
      >
        <span className="flex items-center gap-1.5 text-primary font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          New
        </span>
        <span className="w-px h-3.5 bg-primary/20" />
        <span>Powered by Gemini AI</span>
        <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
      </div>

      <h1
        className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.08]
          animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
      >
        AI code reviews on <br />
        <span
          className="bg-gradient-to-r from-primary via-primary/80 to-primary/60
            bg-clip-text text-transparent"
        >
          every pull request.
        </span>
      </h1>

      <p
        className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed
          animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
      >
        PRobe automatically reviews your GitHub PRs to catch bugs, security
        risks, and performance issues before they reach production.
      </p>

      <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <Link href="/sign-in">
          <Button
            size="lg"
            className="rounded-full px-10 h-13 text-sm font-semibold
              bg-gradient-to-b from-primary to-primary/90
              shadow-[0_2px_12px_0_hsl(var(--primary)/0.35)]
              hover:shadow-[0_4px_24px_0_hsl(var(--primary)/0.45)]
              transition-all duration-300 hover:brightness-110
              relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
          </Button>
        </Link>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-28
          animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500"
      >
        {[
          { value: "< 10s", label: "Avg analysis time" },
          { value: "99%", label: "Issue detection rate" },
          { value: "2x", label: "Faster reviews" },
          { value: "100%", label: "Pull request coverage" },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative px-6 py-5 rounded-2xl
              border border-border/50 bg-background/60 backdrop-blur-sm
              hover:bg-background/80 hover:border-primary/20
              transition-all duration-300 hover:shadow-[0_4px_16px_0_hsl(var(--primary)/0.08)]
              hover:-translate-y-0.5"
          >
            <p className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {item.value}
            </p>
            <p className="text-muted-foreground text-xs mt-1.5 font-medium">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
