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

/**
 * Strip YAML frontmatter from markdown content, promoting the title to an H1.
 * @param {string} content - Raw markdown content
 * @returns {string} Content with frontmatter removed
 */
function removeFrontmatter(content) {
  if (!content) return content;
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return content;
  const titleMatch = match[1].match(/^title:\s*['"]?(.+?)['"]?\s*$/m);
  const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '').trim() : null;
  const rest = content.slice(match[0].length);
  return title ? `# ${title}\n\n${rest}` : rest;
}

module.exports = function buildRawMarkdownDataPlugin(context) {
  const siteDir = context?.siteDir;
  // Captured in loadContent, used in postBuild
  let pluginContent = null;

  return {
    name: 'docusaurus-build-raw-markdown-data-plugin',
    async loadContent() {
      // Get all markdown files from the docs directory
      const docsDirectory = siteDir ? path.join(siteDir, 'docs') : 'docs';
      const rawMarkdownData = {};
      const pathByIdMap = {}; // Maps: "directory/id.ext" -> "directory/filename.ext"

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
              const fileExtension = path.extname(file);
              const lookupKey = path.join(basePath, frontmatterId).replace(/\\/g, '/') + fileExtension;
              pathByIdMap[lookupKey] = relativePath;
            }
          }
        });
      }

      // Scan the docs directory (which contains the actual markdown files)
      scanDirectory(docsDirectory);

      pluginContent = { rawMarkdownData, pathByIdMap };
      return pluginContent;
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;

      // Make both the raw markdown data and ID mapping available globally.
      // IDs are used to get the content for the page based on frontmatter id, not filename.
      setGlobalData({
        rawMarkdownData: content.rawMarkdownData,
        pathByIdMap: content.pathByIdMap,
      });
    },

    async postBuild({ outDir }) {
      if (!pluginContent) return;

      const { rawMarkdownData, pathByIdMap } = pluginContent;
      const written = new Set();

      function writeMarkdownFile(outputFilePath, rawContent) {
        if (written.has(outputFilePath)) return;
        written.add(outputFilePath);
        fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
        fs.writeFileSync(outputFilePath, removeFrontmatter(rawContent), 'utf8');
      }

      // Write filename-based static .md files to the build output directory.
      // e.g. /docs/local/install-dbt.md → served as plain text by the web server.
      for (const [filePath, rawContent] of Object.entries(rawMarkdownData)) {
        writeMarkdownFile(path.join(outDir, filePath), rawContent);
      }

      // Also write ID-based .md files so "page URL + .md" works for pages
      // whose frontmatter id differs from the filename.
      for (const [idPath, filePath] of Object.entries(pathByIdMap)) {
        const rawContent = rawMarkdownData[filePath];
        if (rawContent) {
          writeMarkdownFile(path.join(outDir, idPath), rawContent);
        }
      }
    },
  };
};
