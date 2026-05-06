"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  PenTool,
  FlaskConical,
  BarChart3,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebar } from "./shell";

const navItems = [
  { label: "My Characters", href: "/characters", icon: Users },
  { label: "Create", href: "/create", icon: PenTool },
  { label: "Test", href: "/test", icon: FlaskConical },
  { label: "Evaluate", href: "/evaluate", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-border flex flex-col z-40 transition-all duration-200 ${
        collapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      <div className={`border-b border-border flex items-center ${collapsed ? "p-3 justify-center" : "p-5 justify-between"}`}>
        {collapsed ? (
          <button onClick={() => setCollapsed(false)} className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 hover:bg-accent/90 transition-colors" title="Expand sidebar">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </button>
        ) : (
          <Link href="/characters" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground leading-tight">Meta Meeps</div>
              <div className="text-[11px] text-muted-foreground leading-tight">Character Design Platform</div>
            </div>
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className={`flex-1 py-3 ${collapsed ? "px-2" : "px-3"}`}>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-lg text-sm transition-colors ${
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-accent-light text-accent font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>

        {collapsed && (
          <div className="mt-3 pt-3 border-t border-border">
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="flex items-center justify-center w-full py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <PanelLeftOpen className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </nav>

      <div className={`border-t border-border ${collapsed ? "p-3 flex justify-center" : "p-4"}`}>
        <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent shrink-0">
            AP
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-medium text-foreground">Andy Pratt</div>
              <div className="text-[11px] text-muted-foreground">RealTime AI Design</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
