"use client";

export function Workflow() {
  const steps = [
    {
      step: "Step 01",
      title: "Connect GitHub",
      desc: "One-click integration for your organization. PRobe syncs with your team instantly.",
    },
    {
      step: "Step 02",
      title: "Select Repos",
      desc: "Choose which repositories PRobe should monitor. Webhooks install automatically.",
    },
    {
      step: "Step 03",
      title: "Automate",
      desc: "Every new PR is reviewed by AI automatically, with feedback posted directly to GitHub.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background border-b">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
            Workflow
          </h2>
          <h3 className="text-3xl font-bold tracking-tight leading-tight">
            Up and running <br />
            in 2 minutes.
          </h3>
        </div>

        <div className="md:w-2/3 space-y-16">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-10 group">
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {s.step}
                </span>
                <div className="w-px h-full bg-border mt-4 group-last:hidden" />
              </div>

              <div className="pb-2">
                <h5 className="text-lg font-semibold mb-3 group-hover:translate-x-1 transition-transform">
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
