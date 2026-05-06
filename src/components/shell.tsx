"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Menu, Sparkles } from "lucide-react";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {}, mobileOpen: false, setMobileOpen: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const checkDesktop = useCallback(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, [checkDesktop]);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {/* Mobile header bar */}
      {!isDesktop && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-border flex items-center justify-between px-4 z-50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">Meta Meeps</span>
          </div>
          <div className="w-9" />
        </div>
      )}

      {/* Mobile overlay */}
      {mobileOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar />
      <main
        className="flex-1 min-h-screen transition-all duration-200"
        style={{
          marginLeft: isDesktop ? (collapsed ? 64 : 240) : 0,
          paddingTop: isDesktop ? 0 : 56,
        }}
      >
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
