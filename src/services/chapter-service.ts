import { prisma } from "@/database/prisma";
import { ensureCharacterIdsBelongToProject } from "@/services/project-relations-service";
import type { ChapterCreateInput, ChapterUpdateInput } from "@/validation/chapter-schemas";

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

export async function listChaptersForProject(userId: string, projectId: string) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const chapters = await prisma.chapter.findMany({
    where: { projectId },
    orderBy: [{ orderIndex: "asc" }],
    include: {
      _count: {
        select: {
          linkedCharacters: true,
          plotThreads: true,
          events: true,
        },
      },
    },
  });

  return { project, chapters };
}

export async function getChapterForProject(userId: string, projectId: string, chapterId: string) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      projectId,
    },
    include: {
      linkedCharacters: {
        select: {
          characterId: true,
          character: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!chapter) {
    return null;
  }

  const characters = await prisma.character.findMany({
    where: { projectId },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  return {
    project,
    chapter,
    characters,
  };
}

export async function createChapterForProject(userId: string, projectId: string, input: ChapterCreateInput) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  return prisma.chapter.create({
    data: {
      projectId,
      title: input.title,
      orderIndex: input.orderIndex!,
      summary: input.summary,
      status: input.status,
    },
  });
}

export async function updateChapterForProject(
  userId: string,
  projectId: string,
  chapterId: string,
  input: ChapterUpdateInput,
) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!chapter) {
    return null;
  }

  const linkedCharacterIds = await ensureCharacterIdsBelongToProject(
    prisma,
    projectId,
    input.characterIds,
  );

  return prisma.$transaction(async (tx) => {
    const updated = await tx.chapter.update({
      where: { id: chapter.id },
      data: {
        title: input.title,
        orderIndex: input.orderIndex!,
        summary: input.summary,
        content: input.content,
        status: input.status,
        timeInStory: input.timeInStory,
        notes: input.notes,
      },
    });

    await tx.chapterCharacter.deleteMany({
      where: { chapterId: chapter.id },
    });

    if (linkedCharacterIds.length) {
      await tx.chapterCharacter.createMany({
        data: linkedCharacterIds.map((characterId) => ({
          chapterId: chapter.id,
          characterId,
        })),
      });
    }

    return updated;
  });
}
