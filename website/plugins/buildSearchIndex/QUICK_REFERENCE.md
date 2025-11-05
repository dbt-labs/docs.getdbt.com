# Search Index Generator - Quick Reference

## 🚀 Quick Commands

```bash
# Build documentation and generate search index
cd website && npm run build

# Test the generated index
cd website/plugins/buildSearchIndex && node test.js

# Run examples
cd website/plugins/buildSearchIndex && node example-usage.js

# View index (requires jq)
cat website/build/search-index.json | jq '.'
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `website/plugins/buildSearchIndex/index.js` | Main plugin code |
| `website/build/search-index.json` | Generated index (after build) |
| `website/static/search-index.json` | Dev copy (after build) |
| `website/docusaurus.config.js` | Plugin configuration |

## ⚙️ Configuration

```javascript
// website/docusaurus.config.js
[
  path.resolve("plugins/buildSearchIndex"),
  {
    docsDir: 'docs',              // Source directory
    outputFile: 'search-index.json', // Output filename
    includeContent: true,          // Include full content
    maxContentLength: 10000,       // Max content chars
  },
]
```

## 📝 Frontmatter Options

```yaml
---
id: unique-id                 # Document identifier
title: Document Title          # Display title
description: Short description # Summary text
hide_from_search: false       # Exclude from index
tags: [tag1, tag2]            # Categorization tags
keywords: [kw1, kw2]          # Search keywords
---
```

## 🔍 Index Format

```json
{
  "version": "1.0.0",
  "generated": "2025-11-05T12:00:00.000Z",
  "count": 150,
  "documents": [
    {
      "id": "doc-id",
      "title": "Document Title",
      "description": "Brief description...",
      "url": "/path/to/doc",
      "content": "Full plain text content...",
      "meta": {
        "tags": ["tag1"],
        "keywords": ["kw1"]
      },
      "_source": "path/to/file.md"
    }
  ]
}
```

## 🌐 Access URLs

| Environment | URL |
|-------------|-----|
| Production | https://docs.getdbt.com/search-index.json |
| Local Dev | http://localhost:3000/search-index.json |

## 🧪 Testing

```bash
# Run test suite
cd website/plugins/buildSearchIndex
node test.js

# Expected output
🧪 Testing Search Index Generation
✓ PASS: search-index.json exists
✓ PASS: Valid JSON format
...
✅ All tests passed!

# Check with curl
curl -I https://docs.getdbt.com/search-index.json

# Inspect with jq
curl https://docs.getdbt.com/search-index.json | jq '.count'
```

## 🔧 Common Tasks

### View Index Stats
```bash
cat website/build/search-index.json | jq '{version, count, generated}'
```

### List All Titles
```bash
cat website/build/search-index.json | jq '.documents[].title'
```

### Find Document by ID
```bash
cat website/build/search-index.json | jq '.documents[] | select(.id == "introduction")'
```

### Check File Size
```bash
ls -lh website/build/search-index.json
```

### Search Content
```bash
cat website/build/search-index.json | jq '.documents[] | select(.content | contains("dbt Cloud"))'
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Index not generated | Check build logs: `npm run build 2>&1 \| grep -i "search"` |
| Document missing | Check frontmatter for `hide_from_search: true` |
| URLs wrong | Verify frontmatter `id` field matches expected URL |
| File too large | Reduce `maxContentLength` or set `includeContent: false` |
| Markdown in content | Check specific patterns, may need to update `stripMarkdown()` |

## 📚 Documentation

- **Full Guide**: `/SEARCH_INDEX_GUIDE.md`
- **Plugin README**: `/website/plugins/buildSearchIndex/README.md`
- **MCP Integration**: `/website/plugins/buildSearchIndex/MCP_INTEGRATION.md`
- **Examples**: `/website/plugins/buildSearchIndex/example-usage.js`
- **Changelog**: `/website/plugins/buildSearchIndex/CHANGELOG.md`

## 💻 MCP Server Quick Start

```typescript
// Fetch and load index
const response = await fetch('https://docs.getdbt.com/search-index.json');
const index = await response.json();

// Simple search
function search(query: string) {
  return index.documents.filter(doc =>
    doc.title.toLowerCase().includes(query.toLowerCase()) ||
    doc.content.toLowerCase().includes(query.toLowerCase())
  );
}

// Get document by ID
function getDoc(id: string) {
  return index.documents.find(doc => doc.id === id);
}
```

## 📊 Example Queries

```javascript
// Load index
const index = require('./website/build/search-index.json');

// Count documents
index.count // 150

// Get first document
index.documents[0]

// Search by title
index.documents.filter(d => d.title.includes('Cloud'))

// Get all tags
const tags = new Set(index.documents.flatMap(d => d.meta.tags));

// Find by tag
index.documents.filter(d => d.meta.tags.includes('getting-started'))

// Calculate stats
const totalChars = index.documents.reduce((sum, d) => sum + d.content.length, 0);
const avgLength = totalChars / index.count;
```

## 🔄 Development Workflow

1. **Make changes** to documentation or plugin
2. **Build**: `cd website && npm run build`
3. **Test**: `cd plugins/buildSearchIndex && node test.js`
4. **Verify**: Check generated index
5. **Commit**: `git add . && git commit -m "Update docs"`
6. **Deploy**: `git push` (automatic deployment)

## 🎯 Plugin Options Summary

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `docsDir` | string | `'docs'` | Source directory |
| `outputFile` | string | `'search-index.json'` | Output filename |
| `includeContent` | boolean | `true` | Include full content |
| `maxContentLength` | number | `10000` | Max content length (0=unlimited) |

## 📈 Performance Tips

- ✅ Enable gzip compression (80% size reduction)
- ✅ Set appropriate `maxContentLength` (5000-15000)
- ✅ Use `includeContent: false` for title-only search
- ✅ Cache the index (1 hour recommended)
- ✅ Monitor file size after each build

## 🆘 Getting Help

1. Check build logs for errors
2. Run test suite to identify issues
3. Review documentation in plugin directory
4. Inspect `_source` field in index for debugging
5. Create issue in repository

---

**Version**: 1.0.0 | **Updated**: 2025-11-05

