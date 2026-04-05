"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitPullRequest,
  BarChart2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../icons/Logo";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Reviews",
    href: "/reviews",
    icon: GitPullRequest,
    exact: false,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
    exact: false,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    exact: false,
  },
];

function NavItem({
  href,
  icon: Icon,
  label,
  exact,
}: (typeof navItems)[number]) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-55 shrink-0 h-screen sticky top-0 border-r border-border bg-background">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border shrink-0">
        <Logo className="h-8 w-8" />
        <span className="text-sm font-semibold tracking-tight text-foreground">
          PRobe
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
