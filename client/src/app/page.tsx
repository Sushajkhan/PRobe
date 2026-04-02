"use client";

import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Workflow } from "@/components/landing/Workflow";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">
      <div className="flex flex-col items-center">
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
