"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface SeverityDistributionProps {
  data:
    | {
        CRITICAL?: number;
        WARNING?: number;
        SUGGESTION?: number;
        CLEAN?: number;
      }
    | undefined;
  isLoading: boolean;
}

const COLORS = {
  Critical: "#ef4444",
  Warning: "#f59e0b",
  Suggestion: "#60a5fa",
  Clean: "#4fd1c5",
};

const valueColors = {
  Critical: "text-red-500",
  Warning: "text-amber-400",
  Suggestion: "text-blue-400",
  Clean: "text-emerald-500",
};

export function SeverityDistribution({
  data,
  isLoading,
}: SeverityDistributionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const normalized = useMemo(() => {
    return {
      critical: data?.CRITICAL ?? 0,
      warning: data?.WARNING ?? 0,
      suggestion: data?.SUGGESTION ?? 0,
      clean: data?.CLEAN ?? 0,
    };
  }, [data]);

  const total =
    normalized.critical +
    normalized.warning +
    normalized.suggestion +
    normalized.clean;

  const chartData = [
    { name: "Critical", value: normalized.critical },
    { name: "Warning", value: normalized.warning },
    { name: "Suggestion", value: normalized.suggestion },
    { name: "Clean", value: normalized.clean },
  ];

  const isEmpty = !isLoading && total === 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Severity Distribution
      </p>

      {isLoading ? (
        <div className="flex items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center px-4">
          <PieChartIcon className="h-6 w-6 text-muted-foreground/40" />

          <p className="text-sm text-muted-foreground">No severity data yet</p>

          <p className="text-xs text-muted-foreground/60">
            Severity distribution will appear once reviews are generated.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width={144} height={144}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                      opacity={
                        activeIndex === null
                          ? 1
                          : activeIndex === index
                            ? 1
                            : 0.4
                      }
                      style={{
                        transform:
                          activeIndex === index ? "scale(1.08)" : "scale(1)",
                        transformOrigin: "center",
                      }}
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {activeIndex !== null ? (
                <>
                  <span className="text-sm font-semibold text-foreground">
                    {chartData[activeIndex].name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {chartData[activeIndex].value}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-foreground">
                    {total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    findings
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{
                    background: COLORS[item.name as keyof typeof COLORS],
                  }}
                />
                <span className="text-sm text-muted-foreground w-20">
                  {item.name}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    valueColors[item.name as keyof typeof valueColors]
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
