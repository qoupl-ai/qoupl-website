/**
 * Parses blog content (markdown/plain text) and converts it to HTML
 * Handles: paragraphs, lists, headings, bold text, links, line breaks
 */
export function parseBlogContent(content: string | null): string {
  if (!content) return '';

  // If content already contains HTML tags, return as-is
  if (content.includes('<p>') || content.includes('<div>') || content.includes('<h1>') || content.includes('<ul>')) {
    return content;
  }

  // Split into lines for processing
  const lines = content.split('\n');
  const processedBlocks: string[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const paraText = currentParagraph.join(' ').trim();
      if (paraText) {
        // Process inline formatting before wrapping in <p>
        let processed = paraText;
        
        // Convert bold text (**text** -> <strong>text</strong>)
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert links ([text](url) -> <a href="url">text</a>)
        processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#662D91] hover:underline font-medium">$1</a>');
        
        // Convert inline code (`code` -> <code>code</code>)
        processed = processed.replace(/`([^`]+)`/g, '<code class="text-[#662D91] bg-[#662D91]/10 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        
        processedBlocks.push(`<p class="text-muted-foreground leading-relaxed mb-6">${processed}</p>`);
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (inList && listItems.length > 0) {
      processedBlocks.push(`<ul class="list-disc list-inside space-y-2 my-6 text-muted-foreground pl-4">${listItems.join('')}</ul>`);
      listItems = [];
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Empty line - flush current paragraph/list
    if (!line) {
      flushList();
      flushParagraph();
      continue;
    }

    // Check if line is a heading
    if (/^### (.*)$/.test(line)) {
      flushList();
      flushParagraph();
      const heading = line.replace(/^### /, '').trim();
      processedBlocks.push(`<h3 class="text-xl font-bold text-foreground mt-8 mb-4">${heading}</h3>`);
      continue;
    }
    
    if (/^## (.*)$/.test(line)) {
      flushList();
      flushParagraph();
      const heading = line.replace(/^## /, '').trim();
      processedBlocks.push(`<h2 class="text-2xl font-bold text-foreground mt-8 mb-4">${heading}</h2>`);
      continue;
    }
    
    if (/^# (.*)$/.test(line)) {
      flushList();
      flushParagraph();
      const heading = line.replace(/^# /, '').trim();
      processedBlocks.push(`<h1 class="text-3xl font-bold text-foreground mt-8 mb-4">${heading}</h1>`);
      continue;
    }

    // Check if line is a list item (starts with *, -, or + followed by space)
    if (/^[\*\-\+] /.test(line)) {
      // If we were in a paragraph, flush it first
      if (currentParagraph.length > 0 && !inList) {
        flushParagraph();
      }
      
      const listItemText = line.replace(/^[\*\-\+] /, '').trim();
      
      // Process inline formatting in list items
      let processed = listItemText;
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#662D91] hover:underline font-medium">$1</a>');
      processed = processed.replace(/`([^`]+)`/g, '<code class="text-[#662D91] bg-[#662D91]/10 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
      
      listItems.push(`<li class="my-2 text-muted-foreground">${processed}</li>`);
      inList = true;
      continue;
    }

    // If we were in a list and now we're not, flush the list
    if (inList) {
      flushList();
    }

    // Regular paragraph line
    currentParagraph.push(line);
  }

  // Flush any remaining content
  flushList();
  flushParagraph();

  return processedBlocks.join('\n');
}

