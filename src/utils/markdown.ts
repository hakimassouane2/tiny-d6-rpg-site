// Simple markdown parser for basic formatting
export function parseMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc mb-3">$1</ul>')
    
    // Line breaks
    .replace(/\n/g, '<br>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded mb-3"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
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
    markdown += `## Tags\n${content.tags.join(', ')}\n\n`;
  }
  
  return markdown;
} 