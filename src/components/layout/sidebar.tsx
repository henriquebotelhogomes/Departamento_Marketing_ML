"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Settings, Table2, Users } from "lucide-react";

const navItems = [
  { href: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { href: "/insights" as const, label: "Insights", icon: LineChart },
  { href: "/customers" as const, label: "Clientes", icon: Users },
  { href: "/dataset" as const, label: "Dataset", icon: Table2 },
  { href: "/settings" as const,       label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="card border-b p-4 lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">CardSense</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Marketing Analytics Suite</p>
      </div>

      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
