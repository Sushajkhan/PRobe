import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-24 text-center max-w-4xl mx-auto relative">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted text-xs text-muted-foreground mb-8 hover:bg-muted/70 transition-colors cursor-pointer group">
        <span className="text-primary font-bold">New</span>
        <span className="w-px h-3 bg-border" />
        Powered by Gemini AI
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
        AI code reviews on <br />
        <span className="text-muted-foreground">every pull request.</span>
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
        PRobe automatically reviews your GitHub PRs to catch bugs, security
        risks, and performance issues before they reach production.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Link href="/sign-in">
          <Button size="lg" className="rounded-full px-10 h-12 font-semibold">
            Get started free
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-24 text-sm">
        {[
          { value: "< 10s", label: "Avg analysis time" },
          { value: "99%", label: "Issue detection rate" },
          { value: "2x", label: "Faster reviews" },
          { value: "100%", label: "Pull request coverage" },
        ].map((item, i) => (
          <div
            key={i}
            className="px-6 py-4 rounded-2xl border bg-muted/40 backdrop-blur-sm 
                 hover:bg-muted/70 transition-all hover:scale-[1.03] hover:shadow-md"
          >
            <p className="text-xl font-bold tracking-tight">{item.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
