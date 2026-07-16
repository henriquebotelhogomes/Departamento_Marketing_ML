"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LineChart, LogOut, Settings, Table2, Users, X } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { href: "/insights" as const, label: "Insights", icon: LineChart },
  { href: "/customers" as const, label: "Clientes", icon: Users },
  { href: "/dataset" as const, label: "Dataset", icon: Table2 },
  { href: "/settings" as const,       label: "Configurações", icon: Settings },
];

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  userName?: string | null;
};

export function MobileNav({ isOpen, onClose, userName }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">CardSense</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">          {userName ?? "Usuário"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-slate-200 p-4 dark:border-slate-700">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
