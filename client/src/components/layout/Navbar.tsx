"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  GitPullRequest,
  BarChart2,
  Settings,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Logo } from "../icons/Logo";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/reviews": "Reviews",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

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

function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-55 p-0">
        <VisuallyHidden>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden>

        <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-tight">PRobe</span>
        </div>

        <nav className="flex flex-col gap-0.5 p-3">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
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
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const pathname = usePathname();

  const title = (() => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    const match = Object.keys(pageTitles).find(
      (key) => key !== "/dashboard" && pathname.startsWith(key),
    );
    return match ? pageTitles[match] : "Dashboard";
  })();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
      </div>
    </header>
  );
}
