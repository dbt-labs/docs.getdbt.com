/**
 * Removes frontmatter from markdown content and extracts the title
 * @param {string} content - The markdown content that may contain frontmatter
 * @returns {string} The content without frontmatter, with title as H1 if present
 */
function removeFrontmatter(content) {
  if (!content) return content;
  
  // Check if content starts with frontmatter (--- on first line)
  const lines = content.split('\n');
  if (lines.length > 0 && lines[0].trim() === '---') {
    let title = null;
    
    // Find the closing ---
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        // Extract title from frontmatter if it exists
        const frontmatterLines = lines.slice(1, i);
        for (const line of frontmatterLines) {
          // Match "title: value" or 'title: "value"' or "title: 'value'"
          const titleMatch = line.match(/^title:\s*['"]?(.+?)['"]?\s*$/);
          if (titleMatch) {
            title = titleMatch[1].trim();
            // Remove surrounding quotes if they exist
            title = title.replace(/^["']|["']$/g, '');
            break;
          }
        }
        
        // Get content after frontmatter
        const contentAfterFrontmatter = lines.slice(i + 1).join('\n').trim();
        
        // If we found a title and content doesn't already start with H1, prepend it
        if (title && !contentAfterFrontmatter.match(/^#\s+/)) {
          return `# ${title}\n\n${contentAfterFrontmatter}`;
        }
        
        return contentAfterFrontmatter;
      }
    }
  }
  
  // No frontmatter found, return original content
  return content;
}

/**
 * Hook to get raw markdown content for the current page
 * Uses the pathByIdMap from the plugin to resolve custom frontmatter IDs
 * @returns {string} The raw markdown content or null if not available
 */
export function useRawMarkdownContent() {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    const { usePluginData } = require('@docusaurus/useGlobalData');
    const pluginData = usePluginData('docusaurus-build-raw-markdown-data-plugin');
    const { rawMarkdownData, pathByIdMap } = pluginData || {};

    if (!rawMarkdownData) {
      return null;
    }

    // Get the current URL pathname (query parameters are automatically excluded)
    const pathname = window.location.pathname;
    const urlPath = pathname.split('/').filter(part => part.length > 0).join('/');

    // Try to find the markdown content using multiple strategies
    const potentialPaths = [
      // Strategy 1: Direct path match (URL matches filename)
      `${urlPath}.md`,
      `${urlPath}.mdx`,

      // Strategy 2: Use the ID mapping (handles custom frontmatter IDs)
      // This is the key to solving the problem - the plugin pre-computed this for us!
      pathByIdMap?.[`${urlPath}.md`],
      pathByIdMap?.[`${urlPath}.mdx`],
    ].filter(Boolean); // Remove null/undefined entries

    // Try each potential path
    for (const filePath of potentialPaths) {
      if (rawMarkdownData[filePath]) {
        return removeFrontmatter(rawMarkdownData[filePath]);
      }
    }

    return null;
  } catch (error) {
    console.warn('Could not access raw markdown data:', error);
    return null;
  }
}
