import { prisma } from "@/database/prisma";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/validation/project-schemas";

export async function listProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          chapters: true,
          characters: true,
          plotThreads: true,
          events: true,
          importJobs: true,
        },
      },
    },
  });
}

export async function createProjectForUser(userId: string, input: ProjectCreateInput) {
  return prisma.project.create({
    data: {
      userId,
      ...input,
    },
  });
}

export async function getProjectForUser(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    include: {
      _count: {
        select: {
          chapters: true,
          characters: true,
          plotThreads: true,
          events: true,
          importJobs: true,
        },
      },
    },
  });
}

export async function updateProjectForUser(userId: string, projectId: string, input: ProjectUpdateInput) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return null;
  }

  return prisma.project.update({
    where: {
      id: project.id,
    },
    data: input,
  });
}

export async function getProjectDashboardSnapshot(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    select: {
      id: true,
      title: true,
      genre: true,
      synopsis: true,
      styleNotes: true,
      targetAudience: true,
      status: true,
      updatedAt: true,
      _count: {
        select: {
          chapters: true,
          characters: true,
          plotThreads: true,
          events: true,
          importJobs: true,
          sourceDocuments: true,
        },
      },
      chapters: {
        orderBy: [{ updatedAt: "desc" }],
        take: 1,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          summary: true,
        },
      },
      events: {
        orderBy: [{ updatedAt: "desc" }],
        take: 1,
        select: {
          id: true,
          title: true,
          timeMarker: true,
          updatedAt: true,
        },
      },
      importJobs: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
        select: {
          id: true,
          filename: true,
          status: true,
          chapterCount: true,
          characterCandidateCount: true,
          eventDraftCount: true,
          createdAt: true,
          completedAt: true,
        },
      },
      plotThreads: {
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    ...project,
    activePlotThreadCount: project.plotThreads.length,
    latestChapter: project.chapters[0] ?? null,
    latestEvent: project.events[0] ?? null,
    latestImportJob: project.importJobs[0] ?? null,
  };
}
