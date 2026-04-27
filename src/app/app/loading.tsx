import { Card } from "@/shared/ui/card";

export default function AppLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-6 lg:px-6">
      <div className="hidden w-[296px] xl:block">
        <Card className="min-h-[calc(100vh-3rem)] animate-pulse bg-white/50" />
      </div>
      <div className="min-w-0 flex-1 space-y-6">
        <Card className="h-32 animate-pulse bg-white/50" />
        <Card className="h-[60vh] animate-pulse bg-white/50" />
      </div>
    </div>
  );
}
