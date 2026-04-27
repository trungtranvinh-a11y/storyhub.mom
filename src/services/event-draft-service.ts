import { extractSentences, type ChapterDraft } from "@/services/chapter-split-service";

type EventDraft = {
  chapterOrderIndex: number;
  title: string;
  description: string | null;
  timeMarker: string | null;
  consequence: string | null;
};

const turningPointPattern =
  /\b(phat hien|mo|xuat hien|canh bao|gap|nhan|email|quyet dinh|thu nhan|revealed|warning|discovered|found|met|decided)\b/iu;

function shorten(text: string, maxLength: number) {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length <= maxLength ? compact : `${compact.slice(0, maxLength - 3).trim()}...`;
}

function buildTitle(chapterTitle: string, index: number) {
  return index === 0 ? `Opening beat from ${chapterTitle}` : `Turning point from ${chapterTitle}`;
}

export function buildEventDraftsFromChapters(chapters: ChapterDraft[]) {
  const drafts: EventDraft[] = [];

  for (const chapter of chapters) {
    const sentences = extractSentences(chapter.content);

    if (!sentences.length) {
      continue;
    }

    const primarySentence = sentences[0];
    drafts.push({
      chapterOrderIndex: chapter.orderIndex,
      title: buildTitle(chapter.title, 0),
      description: shorten(primarySentence, 220),
      timeMarker: chapter.timeInStory,
      consequence: null,
    });

    const secondarySentence =
      sentences.find((sentence, index) => index > 0 && turningPointPattern.test(sentence)) ??
      (sentences.length >= 3 ? sentences.at(-1) ?? null : null);

    if (secondarySentence && secondarySentence !== primarySentence) {
      drafts.push({
        chapterOrderIndex: chapter.orderIndex,
        title: buildTitle(chapter.title, 1),
        description: shorten(secondarySentence, 220),
        timeMarker: chapter.timeInStory,
        consequence: null,
      });
    }
  }

  return drafts;
}

export type { EventDraft };
