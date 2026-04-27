import { prisma } from "@/database/prisma";
import type { PlotThreadInput } from "@/validation/plot-thread-schemas";

async function resolveAuthorizedProject(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    select: {
      id: true,
      title: true,
    },
  });
}

export async function listPlotThreadsForProject(userId: string, projectId: string) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const plotThreads = await prisma.plotThread.findMany({
    where: { projectId },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  return { project, plotThreads };
}

export async function createPlotThreadForProject(userId: string, projectId: string, input: PlotThreadInput) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  return prisma.plotThread.create({
    data: {
      projectId,
      ...input,
    },
  });
}

export async function updatePlotThreadForProject(
  userId: string,
  projectId: string,
  plotThreadId: string,
  input: PlotThreadInput,
) {
  const plotThread = await prisma.plotThread.findFirst({
    where: {
      id: plotThreadId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!plotThread) {
    return null;
  }

  return prisma.plotThread.update({
    where: { id: plotThread.id },
    data: input,
  });
}

export async function deletePlotThreadForProject(userId: string, projectId: string, plotThreadId: string) {
  const plotThread = await prisma.plotThread.findFirst({
    where: {
      id: plotThreadId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!plotThread) {
    return null;
  }

  await prisma.plotThread.delete({
    where: { id: plotThread.id },
  });

  return { id: plotThread.id };
}
