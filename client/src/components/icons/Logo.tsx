// src/components/icons/ProbeLogo.tsx

import { Telescope } from "lucide-react";

interface ProbeLogoProps {
  className?: string;
}

export function Logo({ className }: ProbeLogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-sm bg-primary   ${className}`}
    >
      <Telescope className="text-white w-6 h-6 " />
    </div>
  );
}
