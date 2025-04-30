export const setupMarkdownPasteHandler = (editor) => {
  if (!editor || !editor.element) {
    console.warn("Editor not available for paste handler setup");
    return;
  }

  editor.element.addEventListener("paste", async (event) => {
    try {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text/plain");

      if (!hasMarkdownSyntax(pastedText)) {
        return;
      }

      event.preventDefault();
      console.log("Detected markdown paste");

      const blocks = convertSimpleMarkdown(pastedText);

      await insertBlocksIntoEditor(editor, blocks);
    } catch (error) {
      console.error("Error handling markdown paste:", error);
    }
  });
};

const hasMarkdownSyntax = (text) => {
  const patterns = [
    /^#{1,6}\s+/m,
    /^[*-]\s+/m,
    /^>\s+/m,
    /^```/m,
    /\|.*\|.*\|/m,
    /^- \[ \]|\[x\]/m,
  ];

  return patterns.some((pattern) => pattern.test(text));
};

const extractTables = (text) => {
  const tableRegex =
    /\|[^\n]+\|[^\n]*\n\|[\s:-]+\|[\s:-]*\n(\|[^\n]+\|[^\n]*\n)+/g;
  return text.match(tableRegex) || [];
};

const parseTable = (tableText) => {
  const rows = tableText.trim().split("\n");

  if (rows.length < 2) return null;

  const contentRows = rows.filter((row) => !row.match(/^[\|\s:-]+$/));

  const content = contentRows.map((row) => {
    const cells = row
      .split("|")
      .map((cell) => cell.trim())
      .filter(
        (cell, i, arr) =>
          !(i === 0 && cell === "") && !(i === arr.length - 1 && cell === "")
      );

    return cells;
  });

  return {
    type: "table",
    data: {
      withHeadings: true,
      content,
    },
  };
};

const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]+?)\n```/g;
  const matches = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const openingLine = text.substring(
      match.index,
      text.indexOf("\n", match.index)
    );
    const language = openingLine.replace(/```/, "").trim();

    matches.push({
      fullMatch: match[0],
      code: match[1],
      language,
    });
  }

  return matches;
};

const convertSimpleMarkdown = (markdown) => {
  const blocks = [];

  const tables = extractTables(markdown);
  let processedMarkdown = markdown;

  tables.forEach((tableText) => {
    const tableBlock = parseTable(tableText);
    if (tableBlock) {
      blocks.push(tableBlock);
      processedMarkdown = processedMarkdown.replace(
        tableText,
        "\n[TABLE_PLACEHOLDER]\n"
      );
    }
  });

  const codeBlocks = extractCodeBlocks(processedMarkdown);

  codeBlocks.forEach(({ fullMatch, code, language }) => {
    blocks.push({
      type: "code",
      data: {
        code,
        language: language || "plaintext",
      },
    });

    processedMarkdown = processedMarkdown.replace(
      fullMatch,
      "\n[CODE_PLACEHOLDER]\n"
    );
  });

  const lines = processedMarkdown.split("\n");

  let currentParagraph = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "[TABLE_PLACEHOLDER]" || line === "[CODE_PLACEHOLDER]") {
      continue;
    }

    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      if (currentParagraph) {
        blocks.push({
          type: "paragraph",
          data: { text: currentParagraph },
        });
        currentParagraph = "";
      }

      blocks.push({
        type: "header",
        data: {
          text: headerMatch[2],
          level: headerMatch[1].length,
        },
      });
      continue;
    }

    if (line === "") {
      if (currentParagraph) {
        blocks.push({
          type: "paragraph",
          data: { text: currentParagraph },
        });
        currentParagraph = "";
      }
      continue;
    }

    if (currentParagraph) {
      currentParagraph += "<br>" + line;
    } else {
      currentParagraph = line;
    }
  }

  if (currentParagraph) {
    blocks.push({
      type: "paragraph",
      data: { text: currentParagraph },
    });
  }

  return blocks;
};

const insertBlocksIntoEditor = async (editor, blocks) => {
  try {
    const currentIndex = editor.blocks.getCurrentBlockIndex();

    for (let i = 0; i < blocks.length; i++) {
      await editor.blocks.insert(
        blocks[i].type,
        blocks[i].data,
        {},
        currentIndex + i + 1
      );
    }

    console.log(`Inserted ${blocks.length} blocks`);
  } catch (error) {
    console.error("Error inserting blocks:", error);
  }
};
