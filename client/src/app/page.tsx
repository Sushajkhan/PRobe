"use client";

import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Workflow } from "@/components/landing/Workflow";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[30%] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground) / 0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col items-center">
        <Navbar />

        <main className="w-full max-w-6xl px-6">
          <Hero />
          <Features />
          <Workflow />
        </main>

        <Footer />
      </div>
    </div>
  );
}
