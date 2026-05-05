"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  PenTool,
  FlaskConical,
  BarChart3,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "My Characters", href: "/characters", icon: Users },
  { label: "Create", href: "/create", icon: PenTool },
  { label: "Test", href: "/test", icon: FlaskConical },
  { label: "Evaluate", href: "/evaluate", icon: BarChart3 },
  { label: "Iterate", href: "/iterate", icon: RefreshCw },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-border flex flex-col z-40">
      <div className="p-5 border-b border-border">
        <Link href="/characters" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">Meta Meeps</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Character Design Platform</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-3 px-3">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent-light text-accent font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">
            AP
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Andy Pratt</div>
            <div className="text-[11px] text-muted-foreground">RealTime AI Design</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
