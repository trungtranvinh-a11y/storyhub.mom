"use client";

import { BookOpenText, FolderHeart, LayoutDashboard, LibraryBig, Plus, ScrollText, Settings, Sparkles, Swords, Upload, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, extractProjectId } from "@/lib/utils";
import { Badge } from "@/shared/ui/badge";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      className={cn(
        "flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-medium transition",
        isActive
          ? "bg-[linear-gradient(180deg,rgba(39,112,101,1),rgba(25,85,77,1))] !text-white shadow-[0_18px_32px_-20px_rgba(24,83,75,0.72)] [&_svg]:!text-white [&_span]:!text-white"
          : "text-[var(--color-muted)] hover:bg-white/72 hover:text-[var(--color-ink)]",
      )}
      href={item.href}
    >
      <Icon className="size-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const projectId = extractProjectId(pathname);

  const libraryItems: NavItem[] = [
    { href: "/app/projects", label: "Projects", icon: FolderHeart },
    { href: "/app/projects/new", label: "New Project", icon: Plus },
  ];

  const projectItems: NavItem[] = projectId
    ? [
        { href: `/app/projects/${projectId}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
        { href: `/app/projects/${projectId}/imports`, label: "Imports", icon: Upload },
        { href: `/app/projects/${projectId}/chapters`, label: "Chapters", icon: BookOpenText },
        { href: `/app/projects/${projectId}/characters`, label: "Characters", icon: Users2 },
        { href: `/app/projects/${projectId}/timeline`, label: "Timeline", icon: ScrollText },
        { href: `/app/projects/${projectId}/plot-threads`, label: "Plot Threads", icon: Swords },
        { href: `/app/projects/${projectId}/settings`, label: "Settings", icon: Settings },
      ]
    : [];

  return (
    <aside className="hidden w-[310px] shrink-0 border-r border-white/60 bg-[linear-gradient(180deg,rgba(229,238,247,0.88),rgba(224,234,244,0.72))] xl:block">
      <div className="sticky top-0 flex min-h-[calc(100vh-2.5rem)] flex-col gap-5 px-4 py-5">
        <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(24,40,58,0.96),rgba(20,31,46,0.96))] px-4 py-4 text-white shadow-[0_24px_54px_-32px_rgba(9,18,27,0.84)]">
          <div className="absolute inset-y-0 right-0 w-28 bg-[radial-gradient(circle_at_right,rgba(79,197,177,0.34),transparent_62%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.1)] ring-1 ring-[rgba(255,255,255,0.08)]">
            <Sparkles className="size-5" />
          </div>
          <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(212,231,255,0.72)]">StoryHub</p>
              <p className="font-serif text-[2rem] leading-none">Workspace</p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-[rgba(255,255,255,0.54)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <Badge className="bg-[rgba(255,255,255,0.88)]">Desktop mode</Badge>
          <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">Turn raw story text into reviewable structure.</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Projects, imports, chapters, characters, events, and plot threads stay in one persistent control surface.
          </p>
        </div>

        <div className="space-y-2">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Library
          </p>
          {libraryItems.map((item) => (
            <SidebarLink item={item} isActive={pathname === item.href} key={item.href} />
          ))}
        </div>

        {projectItems.length ? (
          <div className="space-y-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Project
            </p>
            {projectItems.map((item) => (
              <SidebarLink item={item} isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)} key={item.href} />
            ))}
          </div>
        ) : null}

        <div className="mt-auto rounded-[22px] border border-dashed border-[var(--color-line)] bg-[rgba(255,255,255,0.58)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(47,127,114,0.12)] text-[var(--color-accent-strong)]">
              <LibraryBig className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">App workflow</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Import first, review always</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Import text, review parsed chapters, then use the side modules to keep cast, timeline, and plot threads in sync.
          </p>
        </div>
      </div>
    </aside>
  );
}
