type ChapterDraft = {
  title: string;
  sourceHeading: string | null;
  content: string;
  summary: string | null;
  timeInStory: string | null;
  orderIndex: number;
};

function normalizeForMatching(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isChapterHeading(line: string) {
  const trimmed = line.trim();
  const normalized = normalizeForMatching(trimmed);

  if (/^#{1,6}\s+.+$/u.test(trimmed)) {
    return true;
  }

  return /^(chapter|chuong|hoi|part|phan|book)\b(?:\s+[\w-]+)*(?:\s*[-:]\s*.*)?$/u.test(normalized);
}

function buildDisplayTitle(sourceHeading: string | null, orderIndex: number) {
  if (!sourceHeading) {
    return `Chapter ${orderIndex}`;
  }

  return sourceHeading.trim();
}

function extractSentences(content: string) {
  const compact = normalizeWhitespace(content);
  if (!compact) {
    return [];
  }

  return compact
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function createSummaryFromContent(content: string) {
  const sentences = extractSentences(content);

  if (!sentences.length) {
    return null;
  }

  const summary = sentences[0];
  return summary.length <= 260 ? summary : `${summary.slice(0, 257).trim()}...`;
}

function inferTimeInStory(content: string) {
  const compact = normalizeWhitespace(content);
  const normalized = normalizeForMatching(compact);
  const match = normalized.match(
    /\b(day|night|morning|evening|afternoon|dawn|dusk|sang|trua|chieu|toi|dem|rang sang|binh minh)\b[^.?!]{0,40}/u,
  );

  return match ? match[0].trim() : null;
}

function buildSingleChapter(normalizedText: string, startingOrderIndex: number): ChapterDraft[] {
  return [
    {
      title: "Chapter 1",
      sourceHeading: null,
      content: normalizedText,
      summary: createSummaryFromContent(normalizedText),
      timeInStory: inferTimeInStory(normalizedText),
      orderIndex: startingOrderIndex,
    },
  ];
}

export function splitTextIntoChapters(normalizedText: string, startingOrderIndex: number) {
  const lines = normalizedText.split("\n");
  const headings = lines
    .map((line, index) => ({
      heading: isChapterHeading(line) ? line.trim() : null,
      index,
    }))
    .filter((entry): entry is { heading: string; index: number } => entry.heading != null);

  if (headings.length < 2) {
    return buildSingleChapter(normalizedText, startingOrderIndex);
  }

  const chapters: ChapterDraft[] = [];

  for (let currentIndex = 0; currentIndex < headings.length; currentIndex += 1) {
    const current = headings[currentIndex];
    const next = headings[currentIndex + 1];
    const contentLines = lines.slice(current.index + 1, next?.index ?? lines.length);
    const content = contentLines.join("\n").trim();

    if (!content) {
      continue;
    }

    chapters.push({
      title: buildDisplayTitle(current.heading, startingOrderIndex + chapters.length),
      sourceHeading: current.heading,
      content,
      summary: createSummaryFromContent(content),
      timeInStory: inferTimeInStory(content),
      orderIndex: startingOrderIndex + chapters.length,
    });
  }

  return chapters.length ? chapters : buildSingleChapter(normalizedText, startingOrderIndex);
}

export { extractSentences };
export type { ChapterDraft };
