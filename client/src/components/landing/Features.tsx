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
    <section id="features" className="mt-24 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 border-l">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-10 border-r border-b transition-colors group relative overflow-hidden hover:bg-muted/50"
          >
            <div className="absolute top-0 left-0 w-1 h-0 bg-primary transition-all duration-300 group-hover:h-full" />

            <div className="mb-6">
              <f.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <h4 className="text-sm font-semibold mb-2">{f.title}</h4>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
