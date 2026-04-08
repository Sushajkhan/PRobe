"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { AnalyticsTrendItem } from "@/types";
import { ChartLine } from "lucide-react";

interface SeverityTrendProps {
  data: AnalyticsTrendItem[] | undefined;
  isLoading: boolean;
}

export function SeverityTrend({ data, isLoading }: SeverityTrendProps) {
  const chartData = (data ?? []).map((item) => ({
    prNumber: item.prNumber,
    issues: item.totalIssues ?? 0,
    severity: item.overallSeverity,
  }));

  return (
    <div className="w-full rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Severity
      </p>

      {isLoading ? (
        <Skeleton className="h-50 w-full rounded-md" />
      ) : chartData.length === 0 ? (
        <div className="h-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 text-center px-4">
            <ChartLine className="h-6 w-6 text-muted-foreground/40" />

            <p className="text-sm text-muted-foreground">No review data yet</p>

            <p className="text-xs text-muted-foreground/60">
              Analytics will appear once reviews are generated.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-55">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="prNumber"
                tickFormatter={(v) => `PR#${v}`}
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelFormatter={(v) => `PR #${v}`}
              />

              <Line
                type="monotone"
                dataKey="issues"
                stroke="#ca3500"
                strokeWidth={2}
                activeDot={{ r: 5 }}
                dot={({ cx, cy, payload }) => {
                  if (cx == null || cy == null) return null;

                  const color =
                    payload?.severity === "CRITICAL"
                      ? "#991b1b"
                      : payload?.severity === "WARNING"
                        ? "#ca3500"
                        : "#f97316";

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke="white"
                      strokeWidth={1}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
