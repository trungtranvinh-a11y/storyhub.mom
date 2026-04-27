import { prisma } from "@/database/prisma";
import { splitTextIntoChapters } from "@/services/chapter-split-service";
import { extractCharacterCandidates, normalizeCharacterKey } from "@/services/character-candidate-service";
import { buildEventDraftsFromChapters } from "@/services/event-draft-service";
import { normalizeImportedText } from "@/services/text-normalizer-service";
import type { ImportUploadInput } from "@/validation/import-schemas";

async function resolveAuthorizedProject(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          chapters: true,
          characters: true,
          events: true,
          importJobs: true,
          sourceDocuments: true,
        },
      },
    },
  });
}

function chunkText(text: string, limit: number) {
  return text.length <= limit ? text : `${text.slice(0, limit).trim()}...`;
}

function mergeCharacterCandidateCounts(texts: string[]) {
  const counts = new Map<string, { name: string; canonicalName: string; mentionCount: number }>();

  for (const text of texts) {
    const chapterCandidates = extractCharacterCandidates(text, 24);

    for (const candidate of chapterCandidates) {
      const key = normalizeCharacterKey(candidate.canonicalName);
      const existing = counts.get(key);

      if (existing) {
        existing.mentionCount += candidate.mentionCount;
        continue;
      }

      counts.set(key, {
        ...candidate,
      });
    }
  }

  return Array.from(counts.values()).sort(
    (left, right) => right.mentionCount - left.mentionCount || left.name.localeCompare(right.name),
  );
}

export async function listImportJobsForProject(userId: string, projectId: string) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const [importJobs, sourceDocuments] = await Promise.all([
    prisma.importJob.findMany({
      where: { projectId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        sourceDocument: {
          select: {
            id: true,
            filename: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.sourceDocument.findMany({
      where: { projectId },
      orderBy: [{ createdAt: "desc" }],
      take: 8,
      select: {
        id: true,
        filename: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    project,
    importJobs,
    sourceDocuments,
  };
}

export async function runImportPipelineForProject(userId: string, projectId: string, input: ImportUploadInput) {
  const project = await resolveAuthorizedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const job = await prisma.importJob.create({
    data: {
      projectId,
      filename: input.filename,
      sourceSizeBytes: input.sizeBytes,
      status: "PROCESSING",
      stage: "UPLOAD",
    },
  });

  try {
    const normalizedText = normalizeImportedText(input.rawText);

    const sourceDocument = await prisma.sourceDocument.create({
      data: {
        projectId,
        filename: input.filename,
        mimeType: input.mimeType,
        rawText: input.rawText,
        normalizedText,
      },
    });

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        sourceDocumentId: sourceDocument.id,
        stage: "NORMALIZATION",
      },
    });

    const highestChapter = await prisma.chapter.findFirst({
      where: { projectId },
      orderBy: [{ orderIndex: "desc" }],
      select: { orderIndex: true },
    });

    const chapterDrafts = splitTextIntoChapters(normalizedText, (highestChapter?.orderIndex ?? 0) + 1);

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        stage: "CHAPTER_SPLIT",
      },
    });

    const createdChapters = [];
    for (const draft of chapterDrafts) {
      const chapter = await prisma.chapter.create({
        data: {
          projectId,
          sourceDocumentId: sourceDocument.id,
          importJobId: job.id,
          title: draft.title,
          sourceHeading: draft.sourceHeading,
          orderIndex: draft.orderIndex,
          summary: draft.summary,
          content: draft.content,
          status: "DRAFT",
          timeInStory: draft.timeInStory,
          parseNotes: "Generated from the current import pipeline. Review text, summary, and links manually.",
        },
      });

      createdChapters.push({
        ...draft,
        id: chapter.id,
      });
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        stage: "CHARACTER_EXTRACTION",
      },
    });

    const candidates = mergeCharacterCandidateCounts(createdChapters.map((chapter) => chapter.content));
    const existingCharacters = await prisma.character.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        canonicalName: true,
        mentionCount: true,
      },
    });

    const characterIdByKey = new Map<string, string>();
    for (const character of existingCharacters) {
      characterIdByKey.set(normalizeCharacterKey(character.canonicalName ?? character.name), character.id);
    }

    for (const candidate of candidates) {
      const key = normalizeCharacterKey(candidate.name);
      const existingId = characterIdByKey.get(key);

      if (existingId) {
        await prisma.character.update({
          where: { id: existingId },
          data: {
            mentionCount: {
              increment: candidate.mentionCount,
            },
          },
        });
        continue;
      }

      const created = await prisma.character.create({
        data: {
          projectId,
          name: candidate.name,
          canonicalName: candidate.name,
          role: "Detected character candidate",
          mentionCount: candidate.mentionCount,
          isCandidate: true,
          detectionSource: `Import ${input.filename}`,
          notes: "Detected heuristically during import. Review and refine manually.",
        },
        select: {
          id: true,
        },
      });

      characterIdByKey.set(key, created.id);
    }

    await prisma.chapterCharacter.deleteMany({
      where: {
        chapterId: {
          in: createdChapters.map((chapter) => chapter.id),
        },
      },
    });

    const chapterCharacterRows: { chapterId: string; characterId: string }[] = [];

    for (const chapter of createdChapters) {
      const chapterCandidates = extractCharacterCandidates(chapter.content, 10);
      for (const candidate of chapterCandidates) {
        const characterId = characterIdByKey.get(normalizeCharacterKey(candidate.name));
        if (characterId) {
          chapterCharacterRows.push({
            chapterId: chapter.id,
            characterId,
          });
        }
      }
    }

    if (chapterCharacterRows.length) {
      const uniqueRows = chapterCharacterRows.filter(
        (row, index, rows) =>
          rows.findIndex((entry) => entry.chapterId === row.chapterId && entry.characterId === row.characterId) === index,
      );

      await prisma.chapterCharacter.createMany({
        data: uniqueRows,
        skipDuplicates: true,
      });
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        stage: "EVENT_DRAFTING",
      },
    });

    const eventDrafts = buildEventDraftsFromChapters(createdChapters);
    for (const eventDraft of eventDrafts) {
      const chapter = createdChapters.find((entry) => entry.orderIndex === eventDraft.chapterOrderIndex);
      await prisma.event.create({
        data: {
          projectId,
          chapterId: chapter?.id,
          title: eventDraft.title,
          description: eventDraft.description,
          timeMarker: eventDraft.timeMarker,
          consequence: eventDraft.consequence,
          isDraft: true,
          detectionSource: `Import ${input.filename}`,
          notes: "Draft event generated during import. Review and refine manually.",
        },
      });
    }

    const completedJob = await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        stage: "COMPLETE",
        chapterCount: createdChapters.length,
        characterCandidateCount: candidates.length,
        eventDraftCount: eventDrafts.length,
        completedAt: new Date(),
      },
      include: {
        sourceDocument: {
          select: {
            id: true,
            filename: true,
          },
        },
      },
    });

    return {
      importJob: completedJob,
      preview: {
        normalizedLength: normalizedText.length,
        chapterCount: createdChapters.length,
        characterCandidateCount: candidates.length,
        eventDraftCount: eventDrafts.length,
        rawExcerpt: chunkText(normalizedText, 220),
      },
    };
  } catch (error) {
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown import error.",
      },
    });

    throw error;
  }
}
