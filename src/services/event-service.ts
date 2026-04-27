import { prisma } from "@/database/prisma";
import { ensureChapterBelongsToProject, ensureCharacterIdsBelongToProject } from "@/services/project-relations-service";
import type { EventInput } from "@/validation/event-schemas";

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

export async function listEventsForProject(userId: string, projectId: string) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const [events, chapters, characters] = await Promise.all([
    prisma.event.findMany({
      where: { projectId },
      orderBy: [{ updatedAt: "desc" }],
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
          },
        },
        characters: {
          select: {
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
    }),
    prisma.chapter.findMany({
      where: { projectId },
      orderBy: [{ orderIndex: "asc" }],
      select: {
        id: true,
        title: true,
        orderIndex: true,
      },
    }),
    prisma.character.findMany({
      where: { projectId },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        role: true,
      },
    }),
  ]);

  return { project, events, chapters, characters };
}

export async function createEventForProject(userId: string, projectId: string, input: EventInput) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const chapterId = await ensureChapterBelongsToProject(prisma, projectId, input.chapterId);
  const characterIds = await ensureCharacterIdsBelongToProject(prisma, projectId, input.characterIds);

  return prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        projectId,
        chapterId,
        title: input.title,
        description: input.description,
        timeMarker: input.timeMarker,
        consequence: input.consequence,
        notes: input.notes,
      },
    });

    if (characterIds.length) {
      await tx.eventCharacter.createMany({
        data: characterIds.map((characterId) => ({
          eventId: event.id,
          characterId,
        })),
      });
    }

    return event;
  });
}

export async function updateEventForProject(userId: string, projectId: string, eventId: string, input: EventInput) {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!event) {
    return null;
  }

  const chapterId = await ensureChapterBelongsToProject(prisma, projectId, input.chapterId);
  const characterIds = await ensureCharacterIdsBelongToProject(prisma, projectId, input.characterIds);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.event.update({
      where: { id: event.id },
      data: {
        chapterId,
        title: input.title,
        description: input.description,
        timeMarker: input.timeMarker,
        consequence: input.consequence,
        notes: input.notes,
      },
    });

    await tx.eventCharacter.deleteMany({
      where: { eventId: event.id },
    });

    if (characterIds.length) {
      await tx.eventCharacter.createMany({
        data: characterIds.map((characterId) => ({
          eventId: event.id,
          characterId,
        })),
      });
    }

    return updated;
  });
}

export async function deleteEventForProject(userId: string, projectId: string, eventId: string) {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!event) {
    return null;
  }

  await prisma.event.delete({
    where: { id: event.id },
  });

  return { id: event.id };
}
