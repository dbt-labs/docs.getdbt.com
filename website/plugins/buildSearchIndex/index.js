/* eslint-disable */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Strip markdown syntax to get plain text
 * @param {string} markdown - The markdown content
 * @returns {string} Plain text content
 */
function stripMarkdown(markdown) {
  let text = markdown;
  
  // Remove frontmatter (already handled by gray-matter, but just in case)
  text = text.replace(/^---[\s\S]*?---\n/m, '');
  
  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove Docusaurus admonitions but keep content
  // Pattern: :::type [optional title]\ncontent\n:::
  text = text.replace(/:::(\w+)([^\n]*)\n([\s\S]*?):::/g, (match, type, title, content) => {
    // Keep the content, optionally prefix with the title or type
    const prefix = title.trim() ? `${title.trim()}: ` : '';
    return `${prefix}${content.trim()}`;
  });
  
  // Remove any standalone ::: markers that weren't caught
  text = text.replace(/^:::.*$/gm, '');
  
  // Convert markdown tables to readable text
  // First, remove table separator lines (|---|---|)
  text = text.replace(/^\|[\s\-:|]+\|$/gm, '');
  
  // Then convert table rows to comma-separated values
  text = text.replace(/^\|(.+)\|$/gm, (match, content) => {
    // Split by pipe, trim whitespace, filter empty, join with comma
    return content.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0)
      .join(', ');
  });
  
  // Remove code blocks (with language specifier)
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Remove headers (but keep the text)
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove bold/italic
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // Remove horizontal rules
  text = text.replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '');
  
  // Remove blockquotes
  text = text.replace(/^\s*>\s?/gm, '');
  
  // Remove list markers
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  
  // Remove MDX import/export statements
  text = text.replace(/^import\s+.*$/gm, '');
  text = text.replace(/^export\s+.*$/gm, '');
  
  // Remove JSX-style components (simple patterns)
  text = text.replace(/<[A-Z][^>]*>/g, '');
  text = text.replace(/<\/[A-Z][^>]*>/g, '');
  
  // Normalize whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/[ \t]+/g, ' ');
  
  return text.trim();
}

/**
 * Extract the first heading from markdown content
 * @param {string} content - The markdown content
 * @returns {string|null} The first heading or null
 */
function extractFirstHeading(content) {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : null;
}

/**
 * Extract version information from VersionBlock components
 * Returns both explicit version arrays and version ranges
 * @param {string} content - The markdown content
 * @returns {Object} Object with versions array and/or versionRange
 */
function extractVersions(content) {
  const result = {
    versions: null,      // Explicit versions from versions={[...]}
    versionRange: null,  // Range from firstVersion/lastVersion
  };
  
  const explicitVersions = new Set();
  let hasFirstVersion = false;
  let hasLastVersion = false;
  let firstVersion = null;
  let lastVersion = null;
  
  // Pattern 1: versions={['1.0', '2.0']} or versions={["1.0", "2.0"]}
  // This indicates explicit, specific versions only
  const arrayMatches = content.matchAll(/<VersionBlock[^>]*versions=\{(\[[^\]]+\])\}[^>]*>/g);
  for (const match of arrayMatches) {
    try {
      // Extract the array content and parse it
      const arrayStr = match[1];
      // Replace single quotes with double quotes for JSON parsing
      const jsonStr = arrayStr.replace(/'/g, '"');
      const versionArray = JSON.parse(jsonStr);
      versionArray.forEach(v => explicitVersions.add(v));
    } catch (e) {
      // If parsing fails, try to extract versions with regex
      const versionStrs = match[1].match(/['"]([^'"]+)['"]/g);
      if (versionStrs) {
        versionStrs.forEach(v => explicitVersions.add(v.replace(/['"]/g, '')));
      }
    }
  }
  
  // Pattern 2: firstVersion="1.0" (means 1.0 and later)
  const firstVersionMatches = content.matchAll(/<VersionBlock[^>]*firstVersion=["']([^"']+)["'][^>]*>/g);
  for (const match of firstVersionMatches) {
    hasFirstVersion = true;
    firstVersion = match[1];
  }
  
  // Pattern 3: lastVersion="2.0" (means up to and including 2.0)
  const lastVersionMatches = content.matchAll(/<VersionBlock[^>]*lastVersion=["']([^"']+)["'][^>]*>/g);
  for (const match of lastVersionMatches) {
    hasLastVersion = true;
    lastVersion = match[1];
  }
  
  // Build result
  if (explicitVersions.size > 0) {
    result.versions = Array.from(explicitVersions).sort();
  }
  
  if (hasFirstVersion || hasLastVersion) {
    result.versionRange = {
      ...(hasFirstVersion && { min: firstVersion }),
      ...(hasLastVersion && { max: lastVersion }),
    };
  }
  
  return result;
}

/**
 * Generate a URL path from file path
 * @param {string} relativePath - Relative file path
 * @param {string} frontmatterId - Optional frontmatter ID
 * @returns {string} URL path
 */
function generateUrlPath(relativePath, frontmatterId) {
  // Remove file extension
  let urlPath = relativePath.replace(/\.(md|mdx)$/, '');
  
  // If there's a frontmatter ID, use it as the last segment
  if (frontmatterId) {
    const dir = path.dirname(urlPath);
    urlPath = dir === '.' ? frontmatterId : `${dir}/${frontmatterId}`;
  }
  
  // Remove 'index' from the end if present
  urlPath = urlPath.replace(/\/index$/, '');
  
  // Ensure it starts with /
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }
  
  // Handle root index
  if (urlPath === '/index' || urlPath === '') {
    urlPath = '/';
  }
  
  return urlPath;
}

/**
 * Create excerpt from content
 * @param {string} text - Plain text content
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} Excerpt
 */
function createExcerpt(text, maxLength = 200) {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');
  
  const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclamation);
  
  if (lastSentence > maxLength * 0.6) {
    return truncated.substring(0, lastSentence + 1).trim();
  }
  
  // Cut at last space
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace).trim() + '...';
  }
  
  return truncated + '...';
}

/**
 * Split content into sections based on headings
 * @param {string} markdownContent - The markdown content
 * @returns {Array} Array of sections with heading and content
 */
function splitIntoSections(markdownContent) {
  const lines = markdownContent.split('\n');
  const sections = [];
  let currentSection = {
    heading: null,
    headingLevel: 0,
    content: [],
  };
  
  for (const line of lines) {
    // Check if line is a heading (## or ### or ####, but not #)
    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
    
    if (headingMatch) {
      // Save previous section if it has content
      if (currentSection.content.length > 0 || currentSection.heading) {
        sections.push({
          heading: currentSection.heading,
          headingLevel: currentSection.headingLevel,
          content: currentSection.content.join('\n').trim(),
        });
      }
      
      // Start new section
      currentSection = {
        heading: headingMatch[2].trim(),
        headingLevel: headingMatch[1].length,
        content: [],
      };
    } else {
      currentSection.content.push(line);
    }
  }
  
  // Don't forget the last section
  if (currentSection.content.length > 0 || currentSection.heading) {
    sections.push({
      heading: currentSection.heading,
      headingLevel: currentSection.headingLevel,
      content: currentSection.content.join('\n').trim(),
    });
  }
  
  return sections;
}

/**
 * Process a single markdown/MDX file and potentially split into multiple chunks
 * @param {string} filePath - Full file path
 * @param {string} relativePath - Relative path from docs root
 * @param {boolean} enableChunking - Whether to split into sections
 * @param {number} minChunkSize - Minimum content size to create separate chunk
 * @returns {Array} Array of processed documents (one or more)
 */
function processMarkdownFile(filePath, relativePath, enableChunking = true, minChunkSize = 200) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    // Skip if frontmatter says to hide from search
    if (frontmatter.hide_from_search || frontmatter.unlisted) {
      return [];
    }
    
    // Extract title
    const title = frontmatter.title || 
                  frontmatter.name || 
                  extractFirstHeading(markdownContent) || 
                  path.basename(relativePath, path.extname(relativePath));
    
    // Generate base URL
    const baseUrl = generateUrlPath(relativePath, frontmatter.id);
    
    // Extract version information from VersionBlock components
    const versionInfo = extractVersions(markdownContent);
    
    // Base metadata shared by all chunks
    const baseMeta = {
      sidebar_label: frontmatter.sidebar_label || null,
      sidebar_position: frontmatter.sidebar_position || null,
      tags: frontmatter.tags || [],
      keywords: frontmatter.keywords || [],
      ...(frontmatter.category && { category: frontmatter.category }),
      ...(frontmatter.type && { type: frontmatter.type }),
      ...(versionInfo.versions && { versions: versionInfo.versions }),
      ...(versionInfo.versionRange && { versionRange: versionInfo.versionRange }),
    };
    
    // If chunking is disabled, return single document
    if (!enableChunking) {
      const plainText = stripMarkdown(markdownContent);
      const description = frontmatter.description || 
                         frontmatter.excerpt || 
                         createExcerpt(plainText);
      
      return [{
        id: frontmatter.id || relativePath,
        title: title,
        description: description,
        url: baseUrl,
        content: plainText,
        meta: baseMeta,
        _source: relativePath,
      }];
    }
    
    // Split into sections
    const sections = splitIntoSections(markdownContent);
    const chunks = [];
    
    // Process each section
    sections.forEach((section, index) => {
      const plainText = stripMarkdown(section.content);
      
      // Skip sections that are too small (likely just navigation or minimal content)
      if (plainText.length < minChunkSize) {
        return;
      }
      
      // Extract section-specific version information
      const sectionVersionInfo = extractVersions(section.content);
      
      // Create section title
      const sectionTitle = section.heading 
        ? `${title} - ${section.heading}`
        : title;
      
      // Create section ID
      const sectionId = section.heading
        ? `${frontmatter.id || relativePath}#${section.heading.toLowerCase().replace(/[^\w]+/g, '-')}`
        : (frontmatter.id || relativePath);
      
      // Create section URL with anchor
      const sectionUrl = section.heading
        ? `${baseUrl}#${section.heading.toLowerCase().replace(/[^\w]+/g, '-')}`
        : baseUrl;
      
      // Create description from section content
      const description = createExcerpt(plainText, 200);
      
      // Merge base metadata with section-specific version information
      const sectionMeta = {
        ...baseMeta,
        section: section.heading || 'Introduction',
        sectionLevel: section.headingLevel,
        pageTitle: title,
        chunkIndex: index,
      };
      
      // If section has specific version info, override the base version info
      if (sectionVersionInfo.versions) {
        sectionMeta.versions = sectionVersionInfo.versions;
      }
      if (sectionVersionInfo.versionRange) {
        sectionMeta.versionRange = sectionVersionInfo.versionRange;
      }
      
      chunks.push({
        id: sectionId,
        title: sectionTitle,
        description: description,
        url: sectionUrl,
        content: plainText,
        meta: sectionMeta,
        _source: relativePath,
      });
    });
    
    // If no valid chunks were created, fall back to whole document
    if (chunks.length === 0) {
      const plainText = stripMarkdown(markdownContent);
      const description = frontmatter.description || 
                         frontmatter.excerpt || 
                         createExcerpt(plainText);
      
      return [{
        id: frontmatter.id || relativePath,
        title: title,
        description: description,
        url: baseUrl,
        content: plainText,
        meta: baseMeta,
        _source: relativePath,
      }];
    }
    
    return chunks;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Recursively scan directory for markdown files
 * @param {string} dir - Directory to scan
 * @param {string} basePath - Base path for relative paths
 * @param {Array} results - Accumulator for results
 * @param {boolean} enableChunking - Whether to chunk documents
 * @param {number} minChunkSize - Minimum chunk size
 */
function scanDirectory(dir, basePath = '', results = [], enableChunking = true, minChunkSize = 200) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (file !== 'node_modules' && !file.startsWith('.')) {
        scanDirectory(filePath, path.join(basePath, file), results, enableChunking, minChunkSize);
      }
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const relativePath = path.join(basePath, file).replace(/\\/g, '/');
      const chunks = processMarkdownFile(filePath, relativePath, enableChunking, minChunkSize);
      
      // Add all chunks from this file
      results.push(...chunks);
    }
  });
  
  return results;
}

module.exports = function buildSearchIndexPlugin(context, options) {
  const {
    docsDir = 'docs',
    outputFile = 'search-index.json',
    includeContent = true,
    maxContentLength = 10000, // Maximum length of content field
    enableChunking = true, // Split documents into sections
    minChunkSize = 200, // Minimum size for a chunk to be created
  } = options || {};
  
  return {
    name: 'docusaurus-build-search-index-plugin',
    
    async postBuild({ outDir }) {
      console.log('Building search index...');
      console.log(`Chunking: ${enableChunking ? 'enabled' : 'disabled'}`);
      if (enableChunking) {
        console.log(`Minimum chunk size: ${minChunkSize} characters`);
      }
      
      // Scan the docs directory
      const docsPath = path.resolve(context.siteDir, docsDir);
      const searchIndex = scanDirectory(docsPath, '', [], enableChunking, minChunkSize);
      
      // Optionally truncate content to reduce file size
      if (maxContentLength > 0) {
        searchIndex.forEach(entry => {
          if (entry.content && entry.content.length > maxContentLength) {
            entry.content = entry.content.substring(0, maxContentLength) + '...';
          }
        });
      }
      
      // Optionally remove content field entirely
      if (!includeContent) {
        searchIndex.forEach(entry => {
          delete entry.content;
        });
      }
      
      // Calculate statistics
      const uniqueFiles = new Set(searchIndex.map(entry => entry._source)).size;
      const avgChunksPerFile = uniqueFiles > 0 ? (searchIndex.length / uniqueFiles).toFixed(1) : 0;
      
      // Create metadata
      const indexData = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        count: searchIndex.length,
        config: {
          chunking: enableChunking,
          minChunkSize: enableChunking ? minChunkSize : null,
          maxContentLength: includeContent ? maxContentLength : null,
        },
        documents: searchIndex,
      };
      
      // Write to build directory
      const outputPath = path.join(outDir, outputFile);
      fs.writeFileSync(outputPath, JSON.stringify(indexData, null, 2), 'utf8');
      
      console.log(`✓ Search index built with ${searchIndex.length} chunks from ${uniqueFiles} files`);
      if (enableChunking) {
        console.log(`  Average ${avgChunksPerFile} chunks per file`);
      }
      console.log(`✓ Written to: ${outputPath}`);
      
      // Also create a copy in the static directory for development
      const staticPath = path.resolve(context.siteDir, 'static', outputFile);
      try {
        fs.mkdirSync(path.dirname(staticPath), { recursive: true });
        fs.writeFileSync(staticPath, JSON.stringify(indexData, null, 2), 'utf8');
        console.log(`✓ Copy written to static directory: ${staticPath}`);
      } catch (error) {
        console.warn(`Could not write to static directory: ${error.message}`);
      }
    },
  };
};

