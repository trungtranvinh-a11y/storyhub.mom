function collapseWhitespace(line: string) {
  return line.replace(/\t/g, " ").replace(/\u00a0/g, " ").replace(/[ ]{2,}/g, " ").trimEnd();
}

export function normalizeImportedText(rawText: string) {
  const withoutBom = rawText.replace(/^\uFEFF/, "");
  const normalizedNewlines = withoutBom.replace(/\r\n?/g, "\n");
  const lines = normalizedNewlines.split("\n").map(collapseWhitespace);

  const compacted: string[] = [];
  let previousWasBlank = false;

  for (const line of lines) {
    const isBlank = line.trim().length === 0;

    if (isBlank) {
      if (!previousWasBlank) {
        compacted.push("");
      }
    } else {
      compacted.push(line);
    }

    previousWasBlank = isBlank;
  }

  return compacted.join("\n").trim();
}
