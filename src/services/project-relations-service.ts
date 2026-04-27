import type { PrismaClient } from "../generated/prisma/client";

type PrismaLike = PrismaClient | Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function ensureChapterBelongsToProject(
  db: PrismaLike,
  projectId: string,
  chapterId?: string | null,
) {
  if (!chapterId) {
    return null;
  }

  const chapter = await db.chapter.findFirst({
    where: {
      id: chapterId,
      projectId,
    },
    select: {
      id: true,
    },
  });

  if (!chapter) {
    throw new Error("Linked chapter does not belong to this project.");
  }

  return chapter.id;
}

export async function ensureCharacterIdsBelongToProject(
  db: PrismaLike,
  projectId: string,
  characterIds: string[],
) {
  const uniqueCharacterIds = [...new Set(characterIds.filter(Boolean))];

  if (!uniqueCharacterIds.length) {
    return [];
  }

  const characters = await db.character.findMany({
    where: {
      projectId,
      id: {
        in: uniqueCharacterIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (characters.length !== uniqueCharacterIds.length) {
    throw new Error("One or more linked characters do not belong to this project.");
  }

  return uniqueCharacterIds;
}
