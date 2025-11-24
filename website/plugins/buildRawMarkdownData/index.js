const fs = require('fs');
const path = require('path');

/**
 * Extract the frontmatter ID from markdown content
 * @param {string} content - The markdown content
 * @returns {string|null} The ID from frontmatter, or null if not found
 */
function extractFrontmatterId(content) {
  // Check if content starts with frontmatter (--- on first line)
  const lines = content.split('\n');
  if (lines.length > 0 && lines[0].trim() === '---') {
    // Find the closing ---
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        // Found the closing ---, parse frontmatter
        const frontmatterLines = lines.slice(1, i);
        for (const line of frontmatterLines) {
          // Match id: "value" or id: 'value' or id: value
          const idMatch = line.match(/^id:\s*["']?([^"'\n]+)["']?\s*$/);
          if (idMatch) {
            return idMatch[1].trim();
          }
        }
        break;
      }
    }
  }
  return null;
}

module.exports = function buildRawMarkdownDataPlugin() {
  return {
    name: 'docusaurus-build-raw-markdown-data-plugin',
    async loadContent() {
      // Get all markdown files from the docs directory
      const docsDirectory = 'docs';
      const rawMarkdownData = {};
      const pathByIdMap = {}; // Maps: "directory/id" -> "directory/filename.md"

      function scanDirectory(dir, basePath = '') {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            // Recursively scan subdirectories
            scanDirectory(filePath, path.join(basePath, file));
          } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            // Read the raw markdown content
            const content = fs.readFileSync(filePath, 'utf8');
            // Use forward slashes for consistency across platforms
            const relativePath = path.join(basePath, file).replace(/\\/g, '/');

            // Store the raw content with the relative path as key
            rawMarkdownData[relativePath] = content;

            // Extract frontmatter ID if present
            const frontmatterId = extractFrontmatterId(content);
            if (frontmatterId) {
              // Create a lookup key: "directory/id.md" -> "directory/filename.md"
              // Use the actual file extension instead of hardcoding .md
              const fileExtension = path.extname(file);
              const lookupKey = path.join(basePath, frontmatterId).replace(/\\/g, '/') + fileExtension;
              pathByIdMap[lookupKey] = relativePath;
            }
          }
        });
      }

      // Scan the docs directory (which contains the actual markdown files)
      scanDirectory(docsDirectory);

      return { rawMarkdownData, pathByIdMap };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;

      // Make both the raw markdown data and ID mapping available globally
      // IDs are used to get the content for the page based in the frontmatter id not the filename
      setGlobalData({
        rawMarkdownData: content.rawMarkdownData,
        pathByIdMap: content.pathByIdMap,
      });
    },
  };
}; 
