"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";

type AppShellProps = Readonly<{
  children: React.ReactNode;
  userName?: string | null;
}>;

export function AppShell({ children, userName }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        userName={userName}
      />

      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 gap-4 px-3 py-3 lg:grid-cols-[260px_1fr] lg:px-4">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="card flex min-h-screen flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">CardSense</p>
            <div className="w-9" />
          </div>

          <Topbar userName={userName} />

          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
