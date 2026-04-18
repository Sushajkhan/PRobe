"use client";

import {
  Search,
  Zap,
  BarChart3,
  ShieldCheck,
  GitBranch,
  Target,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Reviews",
    desc: "Gemini analyzes your diffs and identifies bugs, security risks, and performance issues with detailed explanations.",
    icon: Search,
  },
  {
    title: "Instant Feedback",
    desc: "Reviews are posted as GitHub PR comments within seconds of opening a pull request. No waiting.",
    icon: Zap,
  },
  {
    title: "Analytics Dashboard",
    desc: "Track recurring issues, identify problematic files, and monitor code quality trends over time.",
    icon: BarChart3,
  },
  {
    title: "Security Scanning",
    desc: "Automatically catches SQL injection, hardcoded secrets, and other critical security vulnerabilities.",
    icon: ShieldCheck,
  },
  {
    title: "GitHub Native",
    desc: "Connects in one click. Reviews appear directly on your PR timeline where your team already works.",
    icon: GitBranch,
  },
  {
    title: "Zero Configuration",
    desc: "No YAML files, no configuration. Connect a repo and every new PR is automatically reviewed.",
    icon: Target,
  },
];

export function Features() {
  return (
    <section id="features" className="py-28">
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
          Features
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Everything you need for{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            better code
          </span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm leading-relaxed">
          Powerful features that integrate seamlessly with your existing
          workflow. No setup required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-2xl
              border border-border/50 bg-background/50 backdrop-blur-sm
              hover:bg-background/80 hover:border-primary/20
              hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)]
              transition-all duration-300"
          >
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />

            <div className="relative">
              <div
                className="mb-5 inline-flex items-center justify-center w-11 h-11 rounded-xl
                  bg-primary/[0.08] group-hover:bg-primary/[0.12]
                  transition-colors duration-300"
              >
                <f.icon className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors" />
              </div>

              <h4 className="text-sm font-semibold mb-2.5 tracking-tight">
                {f.title}
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
