import { Card } from "@/shared/ui/card";

export default function ProjectsLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <Card className="h-56 animate-pulse bg-white/50" />
        <Card className="h-56 animate-pulse bg-white/50" />
      </div>
      <Card className="h-72 animate-pulse bg-white/50" />
    </div>
  );
}
