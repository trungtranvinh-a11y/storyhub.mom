import { AppSidebar } from "@/modules/app-shell/components/app-sidebar";
import { AppTopBar } from "@/modules/app-shell/components/app-topbar";

export function AppShell({
  user,
  children,
}: {
  user: {
    name?: string | null;
    email?: string | null;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-3 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1820px] overflow-hidden rounded-[32px] border border-white/70 bg-[rgba(234,242,249,0.7)] shadow-[0_36px_120px_-64px_rgba(25,49,77,0.42)] backdrop-blur-2xl lg:min-h-[calc(100vh-2.5rem)]">
        <AppSidebar />
        <div className="min-w-0 flex-1 bg-[linear-gradient(180deg,rgba(250,252,255,0.82),rgba(244,249,253,0.74))]">
          <div className="flex min-h-full flex-col gap-5 p-3 md:p-4 xl:p-5">
            <AppTopBar user={user} />
            <main className="min-h-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
