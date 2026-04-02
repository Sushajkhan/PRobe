import { Logo } from "../icons/Logo";

export function Footer() {
  return (
    <footer className="w-full py-12 border-t mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />

            <span className="text-sm font-semibold tracking-tight">PRobe</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            © 2026
          </span>
        </div>

        <div className="flex items-center gap-8 text-[13px] text-muted-foreground">
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
        </div>
      </div>
    </footer>
  );
}
