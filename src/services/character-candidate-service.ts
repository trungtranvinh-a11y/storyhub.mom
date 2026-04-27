type CharacterCandidate = {
  name: string;
  canonicalName: string;
  mentionCount: number;
};

const stopwordKeys = new Set([
  "chapter",
  "chuong",
  "hoi",
  "part",
  "phan",
  "book",
  "the",
  "a",
  "an",
  "he",
  "she",
  "they",
  "his",
  "her",
  "their",
  "i",
  "we",
  "you",
  "it",
  "nguoi",
  "trong",
  "tren",
  "tai",
  "cau",
  "con",
  "khi",
  "nam",
]);

const blockedCompoundKeys = new Set(["vien khao", "phu lam", "lam thach", "ls"]);
const blockedSingleKeys = new Set(["sim", "th", "ls", "con", "ong"]);

const titlePrefixes = [
  "ong lao",
  "bac si",
  "tien si",
  "ong",
  "ba",
  "co",
  "cau",
  "anh",
  "chi",
  "lao",
  "ngai",
];

function cleanupCandidate(name: string) {
  return name
    .replace(/["()[\]{}:;,.!?]+$/gu, "")
    .replace(/^["()[\]{}:;,.!?]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForComparison(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeForExtraction(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[“”]/gu, "\"");
}

function stripTitlePrefix(name: string) {
  let normalized = normalizeForComparison(name);

  for (const title of titlePrefixes) {
    if (normalized.startsWith(`${title} `)) {
      normalized = normalized.slice(title.length).trim();
      break;
    }
  }

  return normalized
    .split(" ")
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

export function normalizeCharacterKey(name: string) {
  return normalizeForComparison(stripTitlePrefix(name));
}

function isAllCapsWord(value: string) {
  return value === value.toUpperCase() && value !== value.toLowerCase();
}

function isLikelyCharacterName(name: string) {
  const cleaned = cleanupCandidate(name);
  if (!cleaned || cleaned.length < 2) {
    return false;
  }

  if (/\d/u.test(cleaned)) {
    return false;
  }

  if (cleaned.endsWith("-")) {
    return false;
  }

  if (cleaned.length <= 4 && isAllCapsWord(cleaned)) {
    return false;
  }

  const key = normalizeCharacterKey(cleaned);
  if (!key || stopwordKeys.has(key) || blockedCompoundKeys.has(key) || blockedSingleKeys.has(key)) {
    return false;
  }

  const tokens = key.split(" ");
  const firstToken = tokens[0];
  if (stopwordKeys.has(firstToken)) {
    return false;
  }

  if (tokens.length === 1 && tokens[0].length <= 2) {
    return false;
  }

  return true;
}

function buildCandidate(rawName: string) {
  const cleaned = cleanupCandidate(rawName);
  const canonicalName = stripTitlePrefix(cleaned);

  if (!isLikelyCharacterName(canonicalName)) {
    return null;
  }

  return {
    name: canonicalName,
    canonicalName,
    mentionCount: 1,
  } satisfies CharacterCandidate;
}

export function extractCharacterCandidates(text: string, limit = 18) {
  const extractionText = normalizeForExtraction(text);
  const matches = [
    ...(extractionText.match(
      /\b(?:ong|ba|co|cau|anh|chi|bac\s+si|tien\s+si|lao)\s+[A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+){0,2}\b/giu,
    ) ?? []),
    ...(extractionText.match(/\b[A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+){0,2}\b/gu) ?? []),
  ];

  const counts = new Map<string, CharacterCandidate>();

  for (const rawMatch of matches) {
    const candidate = buildCandidate(rawMatch);
    if (!candidate) {
      continue;
    }

    const key = normalizeCharacterKey(candidate.canonicalName);
    const existing = counts.get(key);

    if (existing) {
      existing.mentionCount += 1;
      continue;
    }

    counts.set(key, candidate);
  }

  return Array.from(counts.values())
    .filter((candidate) => candidate.mentionCount >= 2)
    .sort((left, right) => right.mentionCount - left.mentionCount || left.name.localeCompare(right.name))
    .slice(0, limit);
}
