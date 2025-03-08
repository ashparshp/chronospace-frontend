// src/utils/simpleMarkdownPaste.js

/**
 * A simple but effective markdown paste handler
 * Focused specifically on solving the table and code block issues
 */
export const setupMarkdownPasteHandler = (editor) => {
  if (!editor || !editor.element) {
    console.warn("Editor not available for paste handler setup");
    return;
  }

  // Add paste event listener
  editor.element.addEventListener("paste", async (event) => {
    try {
      // Get clipboard text
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text/plain");

      // Only process if it looks like markdown
      if (!hasMarkdownSyntax(pastedText)) {
        return; // Let EditorJS handle it normally
      }

      // Prevent default to handle it ourselves
      event.preventDefault();
      console.log("Detected markdown paste");

      // Create blocks from markdown
      const blocks = convertSimpleMarkdown(pastedText);

      // Insert blocks
      await insertBlocksIntoEditor(editor, blocks);
    } catch (error) {
      console.error("Error handling markdown paste:", error);
    }
  });
};

/**
 * Check if text contains markdown syntax
 */
const hasMarkdownSyntax = (text) => {
  const patterns = [
    /^#{1,6}\s+/m, // Headers
    /^[*-]\s+/m, // Lists
    /^>\s+/m, // Blockquotes
    /^```/m, // Code blocks
    /\|.*\|.*\|/m, // Tables
    /^- \[ \]|\[x\]/m, // Task lists
  ];

  return patterns.some((pattern) => pattern.test(text));
};

/**
 * Extract tables from markdown text
 */
const extractTables = (text) => {
  const tableRegex =
    /\|[^\n]+\|[^\n]*\n\|[\s:-]+\|[\s:-]*\n(\|[^\n]+\|[^\n]*\n)+/g;
  return text.match(tableRegex) || [];
};

/**
 * Parse a markdown table into EditorJS format
 */
const parseTable = (tableText) => {
  const rows = tableText.trim().split("\n");

  // Skip if not enough rows (need at least header and separator)
  if (rows.length < 2) return null;

  // Filter out separator row (contains dashes and colons)
  const contentRows = rows.filter((row) => !row.match(/^[\|\s:-]+$/));

  // Process rows into cells
  const content = contentRows.map((row) => {
    // Split by pipe and clean up
    const cells = row
      .split("|")
      .map((cell) => cell.trim())
      .filter(
        (cell, i, arr) =>
          // Remove empty cells at beginning and end
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

/**
 * Extract code blocks from markdown text
 */
const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]+?)\n```/g;
  const matches = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Extract language if present
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

/**
 * Simple parser for markdown to EditorJS blocks
 */
const convertSimpleMarkdown = (markdown) => {
  const blocks = [];

  // First handle special blocks that span multiple lines

  // Find and process tables
  const tables = extractTables(markdown);
  let processedMarkdown = markdown;

  tables.forEach((tableText) => {
    const tableBlock = parseTable(tableText);
    if (tableBlock) {
      blocks.push(tableBlock);
      // Remove the table so we don't process it again
      processedMarkdown = processedMarkdown.replace(
        tableText,
        "\n[TABLE_PLACEHOLDER]\n"
      );
    }
  });

  // Find and process code blocks
  const codeBlocks = extractCodeBlocks(processedMarkdown);

  codeBlocks.forEach(({ fullMatch, code, language }) => {
    blocks.push({
      type: "code",
      data: {
        code,
        language: language || "plaintext",
      },
    });

    // Remove the code block
    processedMarkdown = processedMarkdown.replace(
      fullMatch,
      "\n[CODE_PLACEHOLDER]\n"
    );
  });

  // Process remaining lines
  const lines = processedMarkdown.split("\n");

  let currentParagraph = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip placeholders
    if (line === "[TABLE_PLACEHOLDER]" || line === "[CODE_PLACEHOLDER]") {
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      // Push accumulated paragraph if exists
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

    // Empty line - end paragraph
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

    // Default - accumulate paragraph
    if (currentParagraph) {
      currentParagraph += "<br>" + line;
    } else {
      currentParagraph = line;
    }
  }

  // Add final paragraph if exists
  if (currentParagraph) {
    blocks.push({
      type: "paragraph",
      data: { text: currentParagraph },
    });
  }

  return blocks;
};

/**
 * Insert blocks into the editor
 */
const insertBlocksIntoEditor = async (editor, blocks) => {
  try {
    // Get current index
    const currentIndex = editor.blocks.getCurrentBlockIndex();

    // Insert each block
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
