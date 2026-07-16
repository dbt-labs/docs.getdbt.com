import { availableInCurrentVersion } from './available-in-current-version';
import { useContext } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import VersionContext from '../stores/VersionContext';

/**
 * Processes <VersionBlock> JSX tags in raw MDX content, filtering them based
 * on the currently selected dbt version. Blocks available in the given version
 * have their tags removed but content preserved. Unavailable blocks are removed
 * entirely (tags + content).
 *
 * Handles nested VersionBlock elements correctly.
 *
 * @param {string} content - Raw MDX content possibly containing <VersionBlock> tags
 * @param {string} version - The currently selected dbt version (e.g., "1.10")
 * @returns {string} Content with VersionBlock tags processed
 */
export function processVersionBlocks(content, version) {
  if (!content || !version) return content;

  // Regex to find the start of a VersionBlock opening tag.
  // [\s\S]*? matches attributes that may span multiple lines.
  const openTagRegex = /<VersionBlock([\s\S]*?)>/;
  const match = openTagRegex.exec(content);
  if (!match) return content; // No more VersionBlock tags

  const fullOpenTag = match[0];       // e.g., '<VersionBlock firstVersion="1.10">'
  const attrs = match[1];             // e.g., ' firstVersion="1.10"'
  const tagStart = match.index;       // position of '<' in content

  // Extract attribute values
  const firstVersionMatch = attrs.match(/firstVersion=["']([^"']*)["']/);
  const lastVersionMatch = attrs.match(/lastVersion=["']([^"']*)["']/);
  // Default '0' mirrors availableInCurrentVersion's own firstVersion default,
  // making blocks with no firstVersion attribute visible for all versions.
  const firstVersion = firstVersionMatch ? firstVersionMatch[1] : '0';
  const lastVersion = lastVersionMatch ? lastVersionMatch[1] : undefined;

  // Find the matching </VersionBlock> by tracking nesting depth
  const closeTag = '</VersionBlock>';
  let depth = 1;
  let searchPos = tagStart + fullOpenTag.length;
  let closeStart = -1;

  while (depth > 0) {
    const nextOpen = content.indexOf('<VersionBlock', searchPos);
    const nextClose = content.indexOf(closeTag, searchPos);

    if (nextClose === -1) {
      // Malformed MDX — no matching close tag. Stop processing.
      // Note: self-closing <VersionBlock /> also reaches here (no </VersionBlock>)
      // and is returned unchanged (left as raw JSX).
      return content;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Found a nested opening tag before the next close tag
      depth++;
      searchPos = nextOpen + '<VersionBlock'.length;
    } else {
      depth--;
      if (depth === 0) {
        closeStart = nextClose;
      } else {
        searchPos = nextClose + closeTag.length;
      }
    }
  }

  if (closeStart === -1) return content; // Malformed, stop

  const innerContent = content.slice(tagStart + fullOpenTag.length, closeStart);
  const blockEnd = closeStart + closeTag.length;
  const isVisible = availableInCurrentVersion(version, firstVersion, lastVersion);

  // Rebuild content: before-block + (inner content or nothing) + after-block
  const replacement = isVisible ? innerContent : '';
  const processed = content.slice(0, tagStart) + replacement + content.slice(blockEnd);

  // Recurse to handle remaining VersionBlock tags (and newly exposed nested tags)
  return processVersionBlocks(processed, version);
}

/**
 * Strips all <VersionBlock> opening and closing tags from MDX content,
 * keeping ALL inner content regardless of version range. Use this when
 * you want a complete view of all versioned content without filtering.
 *
 * @param {string} content - Raw MDX content possibly containing <VersionBlock> tags
 * @returns {string} Content with VersionBlock tags removed, all inner content preserved
 */
export function stripVersionBlockTags(content) {
  if (!content) return content;
  // Remove opening tags ([\s\S]*? handles multiline attributes)
  let result = content.replace(/<VersionBlock[\s\S]*?>/g, '');
  // Remove closing tags
  result = result.replace(/<\/VersionBlock>/g, '');
  return result;
}

/**
 * Removes frontmatter from markdown content and extracts the title
 * @param {string} content - The markdown content that may contain frontmatter
 * @returns {string} The content without frontmatter, with title as H1 if present
 */
export function removeFrontmatter(content) {
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
  // Both hooks are called unconditionally (React Rules of Hooks requirement).
  // Both are SSR-safe in Docusaurus: usePluginData resolves from the static plugin
  // data manifest, and VersionContext has a well-formed default value in createContext().
  // The SSR guard below safely returns null without having called window APIs.
  const pluginData = usePluginData('docusaurus-build-raw-markdown-data-plugin');
  const { version } = useContext(VersionContext);

  if (typeof window === 'undefined') {
    return null;
  }

  // Don't return content until version is resolved — avoids exposing raw
  // VersionBlock tags before VersionContext hydrates from URL/localStorage.
  if (!version) {
    return null;
  }

  try {
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
        const cleaned = removeFrontmatter(rawMarkdownData[filePath]);
        return processVersionBlocks(cleaned, version);
      }
    }

    return null;
  } catch (error) {
    console.warn('Could not access raw markdown data:', error);
    return null;
  }
}
