"use client";

export function Workflow() {
  const steps = [
    {
      step: "01",
      title: "Connect GitHub",
      desc: "One-click integration for your organization. PRobe syncs with your team instantly.",
    },
    {
      step: "02",
      title: "Select Repos",
      desc: "Choose which repositories PRobe should monitor. Webhooks install automatically.",
    },
    {
      step: "03",
      title: "Automate",
      desc: "Every new PR is reviewed by AI automatically, with feedback posted directly to GitHub.",
    },
  ];

  return (
    <section id="how-it-works" className="py-28">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3 md:sticky md:top-32 md:self-start">
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
            Workflow
          </span>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Up and running <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              in 2 minutes.
            </span>
          </h3>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Three simple steps to automated AI code reviews on every pull
            request.
          </p>
        </div>

        <div className="md:w-2/3 space-y-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="group flex gap-6 p-6 rounded-2xl
                border border-transparent
                hover:border-border/50 hover:bg-background/60 hover:backdrop-blur-sm
                hover:shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.1)]
                transition-all duration-300"
            >
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center
                    bg-primary/[0.08] group-hover:bg-primary/[0.15]
                    border border-primary/20 group-hover:border-primary/40
                    transition-all duration-300"
                >
                  <span className="text-xs font-bold font-mono text-primary">
                    {s.step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-px h-full mt-3 min-h-[24px]
                      bg-gradient-to-b from-primary/30 to-transparent"
                  />
                )}
              </div>

              <div className="pt-1.5">
                <h5
                  className="text-lg font-semibold mb-2 tracking-tight
                    group-hover:text-primary transition-colors duration-300"
                >
                  {s.title}
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
