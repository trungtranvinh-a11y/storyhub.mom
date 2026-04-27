"use client";

import { LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { getRouteContext } from "@/modules/app-shell/lib/route-context";
import { Badge } from "@/shared/ui/badge";
import { buttonLinkClassName, Button } from "@/shared/ui/button";

export function AppTopBar({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
  };
}) {
  const pathname = usePathname();
  const { title, description } = getRouteContext(pathname);

  return (
    <header className="relative overflow-hidden rounded-[24px] border border-white/80 bg-[rgba(248,251,255,0.78)] px-5 py-4 shadow-[var(--shadow-panel)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,rgba(255,255,255,0.54),transparent)]" />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex items-start gap-4">
          <div className="mt-1 flex items-center gap-2 rounded-full border border-[rgba(77,100,125,0.14)] bg-[rgba(255,255,255,0.72)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <span className="size-2 rounded-full bg-[#ff7f66]" />
            <span className="size-2 rounded-full bg-[#ffcc53]" />
            <span className="size-2 rounded-full bg-[#4fc572]" />
          </div>
          <div className="space-y-2">
            <Badge>StoryHub app</Badge>
          <div>
              <h1 className="font-serif text-3xl leading-none text-[var(--color-ink)] md:text-[2.2rem]">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{description}</p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          <Link className={buttonLinkClassName({ size: "sm", variant: "secondary" })} href="/app/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
          <div className="flex items-center gap-3 rounded-[20px] border border-[rgba(22,43,63,0.12)] bg-[linear-gradient(180deg,rgba(29,47,68,0.98),rgba(21,34,51,0.98))] px-3 py-2 text-white shadow-[0_22px_34px_-24px_rgba(17,31,48,0.8)]">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.1)] text-sm font-semibold text-[rgba(231,241,255,0.96)]">
              {(user.name ?? user.email ?? "W").slice(0, 1).toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name ?? "Writer"}</p>
              <p className="text-xs text-[rgba(212,231,255,0.72)]">{user.email ?? "Signed in"}</p>
            </div>
            <Button
              className="border border-[rgba(255,255,255,0.12)] bg-transparent !text-white hover:bg-[rgba(255,255,255,0.08)] hover:!text-white [&_svg]:!text-white [&_span]:!text-white"
              onClick={() => signOut({ callbackUrl: "/login" })}
              size="sm"
              variant="ghost"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
