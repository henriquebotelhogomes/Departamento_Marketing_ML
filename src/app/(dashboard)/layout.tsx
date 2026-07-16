import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthSession } from "@/lib/auth/session";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <AppShell userName={session.user.name}>{children}</AppShell>;
}
