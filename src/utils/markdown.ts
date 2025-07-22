// Simple markdown parser for basic formatting
export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";

  let result = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')

    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Code blocks (before line breaks to avoid interference)
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-2 rounded mb-3"><code>$1</code></pre>'
    )
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');

  // Handle lists more carefully
  const lines = result.split("\n");
  const processedLines: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for unordered list item
    if (line.match(/^\* (.+)$/)) {
      if (!inUnorderedList) {
        // Close previous ordered list if open
        if (inOrderedList && listItems.length > 0) {
          processedLines.push(
            `<ol class="list-decimal mb-3 ml-4">${listItems.join("")}</ol>`
          );
          listItems = [];
          inOrderedList = false;
        }
        inUnorderedList = true;
      }
      listItems.push(
        `<li class="ml-4">${line.replace(/^\* (.+)$/, "$1")}</li>`
      );
    }
    // Check for ordered list item
    else if (line.match(/^\d+\. (.+)$/)) {
      if (!inOrderedList) {
        // Close previous unordered list if open
        if (inUnorderedList && listItems.length > 0) {
          processedLines.push(
            `<ul class="list-disc mb-3 ml-4">${listItems.join("")}</ul>`
          );
          listItems = [];
          inUnorderedList = false;
        }
        inOrderedList = true;
      }
      listItems.push(
        `<li class="ml-4">${line.replace(/^\d+\. (.+)$/, "$1")}</li>`
      );
    }
    // Not a list item
    else {
      // Close any open list
      if (inUnorderedList && listItems.length > 0) {
        processedLines.push(
          `<ul class="list-disc mb-3 ml-4">${listItems.join("")}</ul>`
        );
        listItems = [];
        inUnorderedList = false;
      } else if (inOrderedList && listItems.length > 0) {
        processedLines.push(
          `<ol class="list-decimal mb-3 ml-4">${listItems.join("")}</ol>`
        );
        listItems = [];
        inOrderedList = false;
      }
      processedLines.push(line);
    }
  }

  // Close any remaining list
  if (inUnorderedList && listItems.length > 0) {
    processedLines.push(
      `<ul class="list-disc mb-3 ml-4">${listItems.join("")}</ul>`
    );
  } else if (inOrderedList && listItems.length > 0) {
    processedLines.push(
      `<ol class="list-decimal mb-3 ml-4">${listItems.join("")}</ol>`
    );
  }

  // Join lines and add line breaks
  result = processedLines.join("\n").replace(/\n/g, "<br>");

  return result;
}

export function contentToMarkdown(content: {
  name: string;
  type: string;
  description?: string | null;
  rules?: string | null;
  tags?: string[] | null;
}): string {
  let markdown = `# ${content.name}\n\n`;
  markdown += `**Type:** ${content.type}\n\n`;

  if (content.description) {
    markdown += `## Description\n${content.description}\n\n`;
  }

  if (content.rules) {
    markdown += `## Rules\n${content.rules}\n\n`;
  }

  if (content.tags && content.tags.length > 0) {
    markdown += `## Tags\n${content.tags.join(", ")}\n\n`;
  }

  return markdown;
}
