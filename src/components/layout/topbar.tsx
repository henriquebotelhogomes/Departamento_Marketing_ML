"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

type TopbarProps = {
  userName?: string | null;
};

export function Topbar({ userName }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 md:px-6">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Logado como</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">          {userName ?? "Usuário"}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
