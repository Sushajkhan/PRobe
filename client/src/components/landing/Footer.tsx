import { Logo } from "../icons/Logo";

export function Footer() {
  return (
    <footer className="w-full py-14 mt-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="text-sm font-semibold tracking-tight">PRobe</span>
          </div>
          <span className="text-xs text-muted-foreground/60 font-mono">
            © 2026
          </span>
        </div>

        <div className="flex items-center gap-8 text-[13px] text-muted-foreground font-medium">
          <a
            href="#features"
            className="hover:text-foreground transition-colors relative
              after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px
              after:bg-primary after:transition-all after:duration-300
              hover:after:w-full"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-foreground transition-colors relative
              after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px
              after:bg-primary after:transition-all after:duration-300
              hover:after:w-full"
          >
            How it works
          </a>
        </div>
      </div>
    </footer>
  );
}
