import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
        <Button size="lg" className="rounded-full px-10 h-12 font-semibold">
          Get started free
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-12 px-10 font-medium"
        >
          View the demo
        </Button>
      </div>
    </section>
  );
}
