const fs = require('fs');
const path = require('path');

// Constants mapping
const CONSTANTS_MAP = {
  'Git': '<Constant name="git" />',
  'dbt Cloud': '<Constant name="cloud" />',
  'dbt Core': '<Constant name="core" />',
  'dbt-core': '<Constant name="core" />',
  'dbt': 'dbt',
  'dbt Cloud CLI': '<Constant name="cloud_cli" />',
  'dbt Explorer': '<Constant name="explorer" />',
  'Explorer': '<Constant name="explorer" />',
  'Visual Editor': '<Constant name="visual_editor" />',
  'Query Page': '<Constant name="query_page" />',
  'Query page': '<Constant name="query_page" />',
  'dbt Cloud IDE': '<Constant name="cloud_ide" />',
  'IDE': '<Constant name="cloud_ide" />',
  'Cloud IDE': '<Constant name="cloud_ide" />',
  'dbt Mesh': '<Constant name="mesh" />',
  'Mesh': '<Constant name="mesh" />',
  'Orchestrator': '<Constant name="orchestrator" />',
  'dbt Copilot': '<Constant name="copilot" />',
  'Copilot': '<Constant name="copilot" />',
  'dbt Semantic Layer': '<Constant name="semantic_layer" />',
  'Semantic Layer': '<Constant name="semantic_layer" />'
};

// List of component tags to skip
const SKIP_COMPONENTS = [
  '<Card',
  '<Lightbox',
  '<Lifecycle',
  '<Expandable',
  '<DetailsToggle',
  '<details>',
  '<Tabs',
  '<File'
];

// Function to check if a line should be skipped
function shouldSkipLine(line, inFrontmatter) {
  // Skip if we're in frontmatter
  if (inFrontmatter) return true;
  
  // Skip headers
  if (line.startsWith('# ')) return true;
  if (line.startsWith('## ')) return true;
  if (line.startsWith('### ')) return true;
  if (line.startsWith('#### ')) return true;
  
  // Skip code blocks
  if (line.startsWith('```')) return true;
  
  // Skip component tags
  for (const component of SKIP_COMPONENTS) {
    if (line.includes(component)) return true;
  }
  
  // Skip HTML-like tags
  if (line.includes('<') && line.includes('>')) return true;
  
  // Skip backticks
  if (line.includes('`')) return true;
  
  // Skip snippet references
  if (line.includes('snippet') || line.includes('/snippet')) return true;
  
  return false;
}

// Function to process a line while preserving links
function processLine(line, inFrontmatter) {
  // Skip if line should be skipped
  if (shouldSkipLine(line, inFrontmatter)) return line;

  // Find all markdown links in the line
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  let lastIndex = 0;
  let result = '';

  // Find all links and their positions
  while ((match = linkRegex.exec(line)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      start: match.index,
      end: match.index + match[0].length
    });
  }

  // If no links found, process the entire line
  if (links.length === 0) {
    return replaceConstants(line);
  }

  // Process the line in segments
  lastIndex = 0;
  for (const link of links) {
    // Process text before the link
    if (link.start > lastIndex) {
      result += replaceConstants(line.substring(lastIndex, link.start));
    }

    // Process link text (but not URL)
    const processedText = replaceConstants(link.text);
    result += `[${processedText}](${link.url})`;

    lastIndex = link.end;
  }

  // Process any remaining text after the last link
  if (lastIndex < line.length) {
    result += replaceConstants(line.substring(lastIndex));
  }

  return result;
}

// Function to replace constants in a string
function replaceConstants(text) {
  let result = text;
  for (const [key, value] of Object.entries(CONSTANTS_MAP)) {
    // Create a regex that matches the whole word
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    if (regex.test(result)) {
      result = result.replace(regex, value);
    }
  }
  return result;
}

// Function to process a file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let modified = false;
  let inFrontmatter = false;
  let frontmatterCount = 0;
  let inComponent = false;
  
  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    
    // Track frontmatter state
    if (originalLine.trim() === '---') {
      frontmatterCount++;
      if (frontmatterCount === 1) {
        inFrontmatter = true;
      } else if (frontmatterCount === 2) {
        inFrontmatter = false;
      }
      continue;
    }
    
    // Check if we're entering a component
    for (const component of SKIP_COMPONENTS) {
      if (originalLine.includes(component)) {
        inComponent = true;
        break;
      }
    }
    
    // Skip processing if we're in a component
    if (inComponent) {
      // Check if the component ends on this line
      if (originalLine.includes('/>') || originalLine.includes('</')) {
        inComponent = false;
      }
      continue;
    }
    
    const newLine = processLine(originalLine, inFrontmatter);
    
    if (originalLine !== newLine) {
      lines[i] = newLine;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Modified: ${filePath}`);
  }
}

// Function to recursively process directories
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

// Start processing from the docs and reference directories
const docsDir = path.join(__dirname, '../docs');
const referenceDir = path.join(__dirname, '../reference');

if (fs.existsSync(docsDir)) {
  processDirectory(docsDir);
}

if (fs.existsSync(referenceDir)) {
  processDirectory(referenceDir);
} 
