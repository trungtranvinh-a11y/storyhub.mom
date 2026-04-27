import { prisma } from "@/database/prisma";
import { ensureChapterBelongsToProject } from "@/services/project-relations-service";
import type { CharacterCreateInput, CharacterUpdateInput } from "@/validation/character-schemas";

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

type CharacterListSort = "confidence" | "alphabetical";
type CharacterListFilter = "all" | "candidates" | "reviewed";

export async function listCharactersForProject(
  userId: string,
  projectId: string,
  options?: {
    sort?: CharacterListSort;
    filter?: CharacterListFilter;
  },
) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const sort = options?.sort ?? "confidence";
  const filter = options?.filter ?? "all";

  const where = {
    projectId,
    ...(filter === "candidates" ? { isCandidate: true } : {}),
    ...(filter === "reviewed" ? { isCandidate: false } : {}),
  };

  const orderBy =
    sort === "alphabetical"
      ? [{ name: "asc" as const }]
      : [{ mentionCount: "desc" as const }, { isCandidate: "desc" as const }, { name: "asc" as const }];

  const characters = await prisma.character.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: {
          chapters: true,
          eventLinks: true,
        },
      },
      firstAppearanceChapter: {
        select: {
          id: true,
          title: true,
          orderIndex: true,
        },
      },
    },
  });

  return {
    project,
    characters,
    controls: {
      sort,
      filter,
    },
  };
}

export async function getCharacterForProject(userId: string, projectId: string, characterId: string) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      projectId,
    },
    include: {
      firstAppearanceChapter: {
        select: {
          id: true,
          title: true,
          orderIndex: true,
        },
      },
      chapters: {
        select: {
          chapter: {
            select: {
              id: true,
              title: true,
              orderIndex: true,
            },
          },
        },
        take: 6,
      },
      eventLinks: {
        select: {
          event: {
            select: {
              id: true,
              title: true,
              timeMarker: true,
            },
          },
        },
        take: 6,
      },
    },
  });

  if (!character) {
    return null;
  }

  const chapters = await prisma.chapter.findMany({
    where: {
      projectId,
    },
    orderBy: {
      orderIndex: "asc",
    },
    select: {
      id: true,
      title: true,
      orderIndex: true,
    },
  });

  const mergeTargets = await prisma.character.findMany({
    where: {
      projectId,
      id: {
        not: characterId,
      },
    },
    orderBy: [{ mentionCount: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      alias: true,
      mentionCount: true,
      isCandidate: true,
    },
  });

  return {
    project,
    character,
    chapters,
    mergeTargets,
  };
}

export async function createCharacterForProject(userId: string, projectId: string, input: CharacterCreateInput) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const firstAppearanceChapterId = await ensureChapterBelongsToProject(
    prisma,
    projectId,
    input.firstAppearanceChapterId,
  );

  return prisma.character.create({
    data: {
      projectId,
      ...input,
      isCandidate: false,
      firstAppearanceChapterId,
    },
  });
}

export async function updateCharacterForProject(
  userId: string,
  projectId: string,
  characterId: string,
  input: CharacterUpdateInput,
) {
  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!character) {
    return null;
  }

  const firstAppearanceChapterId = await ensureChapterBelongsToProject(
    prisma,
    projectId,
    input.firstAppearanceChapterId,
  );

  return prisma.character.update({
    where: {
      id: character.id,
    },
    data: {
      ...input,
      isCandidate: false,
      firstAppearanceChapterId,
    },
  });
}

export async function deleteCharacterForProject(userId: string, projectId: string, characterId: string) {
  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      projectId,
      project: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!character) {
    return null;
  }

  await prisma.character.delete({
    where: {
      id: character.id,
    },
  });

  return { id: character.id };
}

export async function mergeCharacterIntoProjectCharacter(
  userId: string,
  projectId: string,
  sourceCharacterId: string,
  targetCharacterId: string,
) {
  if (sourceCharacterId === targetCharacterId) {
    throw new Error("Choose a different destination character.");
  }

  const [sourceCharacter, targetCharacter] = await Promise.all([
    prisma.character.findFirst({
      where: {
        id: sourceCharacterId,
        projectId,
        project: {
          userId,
        },
      },
    }),
    prisma.character.findFirst({
      where: {
        id: targetCharacterId,
        projectId,
        project: {
          userId,
        },
      },
    }),
  ]);

  if (!sourceCharacter || !targetCharacter) {
    return null;
  }

  const aliasParts = [targetCharacter.alias, sourceCharacter.alias, sourceCharacter.name]
    .flatMap((value) => (value ? value.split(",") : []))
    .map((value) => value.trim())
    .filter(Boolean);

  const mergedAlias = Array.from(new Set(aliasParts.filter((value) => value !== targetCharacter.name))).join(", ") || null;

  const mergedNotes = [targetCharacter.notes, sourceCharacter.notes].filter(Boolean).join("\n\n").trim() || null;

  await prisma.$transaction(async (tx) => {
    const chapterRows = await tx.chapterCharacter.findMany({
      where: {
        characterId: sourceCharacter.id,
      },
      select: {
        chapterId: true,
      },
    });

    if (chapterRows.length) {
      await tx.chapterCharacter.createMany({
        data: chapterRows.map((row) => ({ chapterId: row.chapterId, characterId: targetCharacter.id })),
        skipDuplicates: true,
      });
    }

    const eventRows = await tx.eventCharacter.findMany({
      where: {
        characterId: sourceCharacter.id,
      },
      select: {
        eventId: true,
      },
    });

    if (eventRows.length) {
      await tx.eventCharacter.createMany({
        data: eventRows.map((row) => ({ eventId: row.eventId, characterId: targetCharacter.id })),
        skipDuplicates: true,
      });
    }

    await tx.character.update({
      where: {
        id: targetCharacter.id,
      },
      data: {
        alias: mergedAlias,
        canonicalName: targetCharacter.canonicalName ?? targetCharacter.name,
        mentionCount: targetCharacter.mentionCount + sourceCharacter.mentionCount,
        isCandidate: false,
        detectionSource: targetCharacter.detectionSource ?? sourceCharacter.detectionSource,
        firstAppearanceChapterId: targetCharacter.firstAppearanceChapterId ?? sourceCharacter.firstAppearanceChapterId,
        notes: mergedNotes,
      },
    });

    await tx.chapterCharacter.deleteMany({
      where: {
        characterId: sourceCharacter.id,
      },
    });

    await tx.eventCharacter.deleteMany({
      where: {
        characterId: sourceCharacter.id,
      },
    });

    await tx.character.delete({
      where: {
        id: sourceCharacter.id,
      },
    });
  });

  return { id: targetCharacter.id };
}
