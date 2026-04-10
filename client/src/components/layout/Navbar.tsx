"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import {
  LayoutDashboard,
  GitPullRequest,
  BarChart2,
  Settings,
} from "lucide-react";
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
  { label: "Reviews", href: "/reviews", icon: GitPullRequest },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 p-0 bg-background/95 backdrop-blur-xl"
      >
        <VisuallyHidden>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden>

        <div className="flex items-center gap-2 px-4 h-14 border-b border-border/50">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-semibold">PRobe</span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                )}
              >
                <Icon className="h-4 w-4" />
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
    <header
      className="sticky top-0 z-10 flex h-14 items-center justify-between
      px-4 md:px-6 bg-background/70 backdrop-blur-xl border-b border-border/30"
    >
      <div className="flex items-center gap-3">
        <MobileNav />
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      </div>

      <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
    </header>
  );
}
