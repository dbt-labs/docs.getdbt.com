const fs = require('fs');
const path = require('path');

// Patterns to clean up
const DUPLICATE_PATTERNS = [
  {
    pattern: /<Constant name="dbt" \/> <Constant name="([^"]+)" \/>/g,
    replacement: '<Constant name="$1" />'
  },
  {
    pattern: /<Constant name="cloud" \/> <Constant name="([^"]+)" \/>/g,
    replacement: '<Constant name="$1" />'
  }
];

// Function to process a file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply each pattern
  for (const { pattern, replacement } of DUPLICATE_PATTERNS) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Cleaned up duplicates in: ${filePath}`);
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
