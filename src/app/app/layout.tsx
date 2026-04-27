import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/modules/auth/server/session";
import { AppShell } from "@/modules/app-shell/components/app-shell";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
