// src/utils/markdownPasteHandler.js
import { marked } from "marked";

/**
 * Handles the paste event in the editor and converts markdown to EditorJS blocks
 * @param {Object} editor - The EditorJS instance
 */
export const setupMarkdownPasteHandler = (editor) => {
  // Check if editor is available
  if (!editor || !editor.element) {
    console.warn("Editor not available for markdown paste handler setup");
    return;
  }

  // Add paste event listener to the editor element
  editor.element.addEventListener("paste", async (event) => {
    try {
      // Get clipboard text content
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text/plain");

      // Check if it looks like markdown
      if (!looksLikeMarkdown(pastedText)) {
        return; // Let EditorJS handle normal paste
      }

      // Prevent default paste behavior
      event.preventDefault();

      console.log("Detected markdown paste, converting...");

      // Convert markdown to EditorJS blocks
      const blocks = await convertMarkdownToBlocks(pastedText);

      // Insert blocks into editor
      insertBlocksIntoEditor(editor, blocks);
    } catch (error) {
      console.error("Error handling markdown paste:", error);
    }
  });
};

/**
 * Quickly checks if text might be markdown
 * @param {string} text - Text to check
 * @returns {boolean} True if text looks like markdown
 */
const looksLikeMarkdown = (text) => {
  // Simple heuristic to detect markdown-like content
  // Look for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s+/m, // Headers
    /^[*-]\s+/m, // Unordered lists
    /^>\s+/m, // Blockquotes
    /^```[\s\S]*```$/m, // Code blocks
    /^1\.\s+/m, // Ordered lists
    /\[.*\]\(.*\)/, // Links
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italics
    /!\[.*\]\(.*\)/, // Images
    /^---$/m, // Horizontal rules
    /^- \[ \]|\[x\]/m, // Task lists
  ];

  // Check if any markdown pattern matches
  return markdownPatterns.some((pattern) => pattern.test(text));
};

/**
 * Convert markdown text to EditorJS blocks
 * @param {string} markdownText - Markdown text to convert
 * @returns {Array} Array of EditorJS blocks
 */
const convertMarkdownToBlocks = async (markdownText) => {
  // Parse markdown to HTML using marked
  const html = marked(markdownText);

  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const blocks = [];

  // Process the HTML nodes to create EditorJS blocks
  Array.from(tempDiv.childNodes).forEach((node) => {
    const block = createBlockFromNode(node);
    if (block) {
      blocks.push(block);
    }
  });

  return blocks;
};

/**
 * Create an EditorJS block from a DOM node
 * @param {Node} node - DOM node to convert
 * @returns {Object|null} EditorJS block or null if not convertible
 */
const createBlockFromNode = (node) => {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    // Skip non-element nodes (like text nodes)
    return null;
  }

  const tagName = node.tagName.toLowerCase();

  // Handle different element types
  switch (tagName) {
    case "p":
      return {
        type: "paragraph",
        data: {
          text: node.innerHTML,
        },
      };

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return {
        type: "header",
        data: {
          text: node.textContent,
          level: parseInt(tagName.slice(1)),
        },
      };

    case "ul":
      return {
        type: "list",
        data: {
          style: "unordered",
          items: Array.from(node.querySelectorAll("li")).map(
            (li) => li.innerHTML
          ),
        },
      };

    case "ol":
      return {
        type: "list",
        data: {
          style: "ordered",
          items: Array.from(node.querySelectorAll("li")).map(
            (li) => li.innerHTML
          ),
        },
      };

    case "blockquote":
      return {
        type: "quote",
        data: {
          text: node.innerHTML,
          caption: "",
        },
      };

    case "pre":
      const codeNode = node.querySelector("code");
      return {
        type: "code",
        data: {
          code: codeNode ? codeNode.textContent : node.textContent,
        },
      };

    case "img":
      return {
        type: "image",
        data: {
          file: {
            url: node.src,
          },
          caption: node.alt,
          withBorder: false,
          stretched: false,
          withBackground: false,
        },
      };

    // Handle task lists (require special detection)
    case "div":
      if (
        node.classList.contains("task-list") ||
        node.querySelector('input[type="checkbox"]')
      ) {
        const items = Array.from(node.querySelectorAll("li")).map((li) => {
          const checkbox = li.querySelector('input[type="checkbox"]');
          return {
            text: li.innerHTML.replace(/<input[^>]*>/g, "").trim(),
            checked: checkbox ? checkbox.checked : false,
          };
        });

        return {
          type: "checklist",
          data: {
            items,
          },
        };
      }
      break;

    default:
      // Return paragraph for unknown elements with content
      if (node.textContent.trim()) {
        return {
          type: "paragraph",
          data: {
            text: node.innerHTML,
          },
        };
      }
  }

  return null;
};

/**
 * Insert blocks into the editor
 * @param {Object} editor - EditorJS instance
 * @param {Array} blocks - Array of blocks to insert
 */
const insertBlocksIntoEditor = async (editor, blocks) => {
  try {
    // Get current blocks
    const currentData = await editor.save();
    const currentIndex = editor.blocks.getCurrentBlockIndex();

    // Insert new blocks at current position
    blocks.forEach((block, index) => {
      editor.blocks.insert(
        block.type,
        block.data,
        {},
        currentIndex + index + 1
      );
    });

    console.log("Successfully inserted markdown blocks into editor");
  } catch (error) {
    console.error("Error inserting blocks into editor:", error);
  }
};
