import { extractProjectId } from "@/lib/utils";

const routeTitleMap: Record<string, string> = {
  dashboard: "Project Dashboard",
  chapters: "Chapter Review",
  characters: "Character Review",
  timeline: "Story Timeline",
  "plot-threads": "Plot Threads",
  imports: "Import Jobs",
  settings: "Project Settings",
  new: "New Project",
  projects: "Project Library",
};

export function getRouteContext(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const projectId = extractProjectId(pathname);
  const lastSegment = segments.at(-1) ?? "projects";

  if (pathname.includes("/chapters/") && lastSegment !== "chapters") {
    return {
      projectId,
      title: "Chapter Review",
      description: "Review parsed chapter text, clean up metadata, and verify structured links before analysis spreads downstream.",
    };
  }

  if (pathname.includes("/characters/") && lastSegment !== "characters") {
    return {
      projectId,
      title: "Character Profile",
      description: "Review detected character data, merge details manually, and keep continuity notes in one place.",
    };
  }

  return {
    projectId,
    title: routeTitleMap[lastSegment] ?? "Story Tracking Workspace",
    description:
      projectId != null
        ? "Structured project modules live here so imported story data stays reviewable, consistent, and easy to analyze."
        : "Start from projects, then drill into imported chapters, characters, timeline, and plot threads.",
  };
}
