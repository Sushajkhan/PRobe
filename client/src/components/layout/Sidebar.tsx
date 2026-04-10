"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  collapsed,
}: (typeof navItems)[number] & { collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-2.5 py-2 text-sm transition-colors",
        collapsed ? "justify-center" : "gap-2.5",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-border/50 bg-[#fdfdfd] transition-all duration-300",
        collapsed ? "w-16" : "w-55",
      )}
    >
      <div
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex items-center gap-2 px-4 h-14 shrink-0 cursor-pointer"
      >
        <Logo className="h-8 w-8 shrink-0" />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-foreground">
            PRobe
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}
