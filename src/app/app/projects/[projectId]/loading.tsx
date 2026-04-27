import { Card } from "@/shared/ui/card";

export default function ProjectRouteLoading() {
  return (
    <div className="space-y-6">
      <Card className="h-40 animate-pulse bg-white/50" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="h-[60vh] animate-pulse bg-white/50" />
        <div className="space-y-6">
          <Card className="h-56 animate-pulse bg-white/50" />
          <Card className="h-40 animate-pulse bg-white/50" />
        </div>
      </div>
    </div>
  );
}
