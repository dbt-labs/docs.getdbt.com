# MCP Server Integration Guide

This guide explains how to integrate the generated search index with your MCP (Model Context Protocol) server for improved documentation accessibility in LLMs.

## Architecture Overview

```
┌─────────────────────────────────────┐
│   Docusaurus Documentation Site     │
│  (docs.getdbt.com repository)       │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  buildSearchIndex Plugin     │  │
│  │  - Scans .md/.mdx files      │  │
│  │  - Extracts content          │  │
│  │  - Generates JSON index      │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│               ▼                     │
│    search-index.json                │
│    (deployed to /search-index.json) │
└─────────────────┬───────────────────┘
                  │
                  │ HTTPS
                  │
                  ▼
┌─────────────────────────────────────┐
│        MCP Server                   │
│     (separate repository)           │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Index Loader                │  │
│  │  - Fetches search-index.json │  │
│  │  - Caches locally            │  │
│  │  - Updates periodically      │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│               ▼                     │
│  ┌──────────────────────────────┐  │
│  │  Search Engine               │  │
│  │  - Full-text search          │  │
│  │  - Semantic search           │  │
│  │  - Context retrieval         │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│               ▼                     │
│  ┌──────────────────────────────┐  │
│  │  MCP Tools/Resources         │  │
│  │  - search_docs()             │  │
│  │  - get_document()            │  │
│  │  - list_sections()           │  │
│  └──────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │
                  │ MCP Protocol
                  │
                  ▼
┌─────────────────────────────────────┐
│            LLM Client               │
│   (Claude, GPT, or other LLM)       │
└─────────────────────────────────────┘
```

## MCP Server Implementation

### 1. Index Loader Module

Create a module to fetch and cache the search index:

```typescript
// src/index-loader.ts
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

interface SearchIndex {
  version: string;
  generated: string;
  count: number;
  documents: Document[];
}

interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  content: string;
  meta: {
    sidebar_label?: string;
    sidebar_position?: number;
    tags: string[];
    keywords: string[];
    [key: string]: any;
  };
  _source: string;
}

export class IndexLoader {
  private indexUrl = 'https://docs.getdbt.com/search-index.json';
  private cacheDir = '.cache';
  private cachePath = path.join(this.cacheDir, 'search-index.json');
  private cacheMaxAge = 3600000; // 1 hour in milliseconds
  private index: SearchIndex | null = null;

  async loadIndex(): Promise<SearchIndex> {
    // Try to load from cache first
    const cached = await this.loadFromCache();
    if (cached) {
      this.index = cached;
      return cached;
    }

    // Fetch from remote
    console.log('Fetching search index from', this.indexUrl);
    const response = await fetch(this.indexUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch search index: ${response.statusText}`);
    }

    const data = await response.json() as SearchIndex;
    this.index = data;

    // Save to cache
    await this.saveToCache(data);

    console.log(`Loaded ${data.count} documents from search index`);
    return data;
  }

  private async loadFromCache(): Promise<SearchIndex | null> {
    try {
      const stats = await fs.stat(this.cachePath);
      const age = Date.now() - stats.mtimeMs;

      if (age < this.cacheMaxAge) {
        console.log('Loading search index from cache');
        const content = await fs.readFile(this.cachePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      // Cache doesn't exist or is invalid
    }

    return null;
  }

  private async saveToCache(data: SearchIndex): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      await fs.writeFile(this.cachePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  }

  getIndex(): SearchIndex | null {
    return this.index;
  }
}
```

### 2. Search Engine Module

Implement search capabilities:

```typescript
// src/search-engine.ts
import { SearchIndex, Document } from './index-loader';

export interface SearchResult {
  document: Document;
  score: number;
  matchedFields: string[];
}

export class SearchEngine {
  private index: SearchIndex;

  constructor(index: SearchIndex) {
    this.index = index;
  }

  /**
   * Full-text search across all document fields
   */
  search(query: string, limit = 10): SearchResult[] {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    const results = this.index.documents.map(doc => {
      let score = 0;
      const matchedFields: string[] = [];
      
      terms.forEach(term => {
        // Title matching (highest weight)
        if (doc.title.toLowerCase().includes(term)) {
          score += 50;
          if (!matchedFields.includes('title')) {
            matchedFields.push('title');
          }
        }
        
        // Description matching
        if (doc.description.toLowerCase().includes(term)) {
          score += 20;
          if (!matchedFields.includes('description')) {
            matchedFields.push('description');
          }
        }
        
        // Content matching
        const contentLower = doc.content.toLowerCase();
        const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length;
        score += Math.min(occurrences * 2, 30); // Cap at 30 points
        if (occurrences > 0 && !matchedFields.includes('content')) {
          matchedFields.push('content');
        }
        
        // Tags matching
        if (doc.meta.tags.some(tag => tag.toLowerCase().includes(term))) {
          score += 40;
          if (!matchedFields.includes('tags')) {
            matchedFields.push('tags');
          }
        }
        
        // Keywords matching
        if (doc.meta.keywords.some(kw => kw.toLowerCase().includes(term))) {
          score += 35;
          if (!matchedFields.includes('keywords')) {
            matchedFields.push('keywords');
          }
        }
      });
      
      return { document: doc, score, matchedFields };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
    
    return results;
  }

  /**
   * Get a document by its ID
   */
  getDocumentById(id: string): Document | undefined {
    return this.index.documents.find(doc => doc.id === id);
  }

  /**
   * Get a document by its URL
   */
  getDocumentByUrl(url: string): Document | undefined {
    return this.index.documents.find(doc => doc.url === url);
  }

  /**
   * Get all documents with a specific tag
   */
  getDocumentsByTag(tag: string): Document[] {
    return this.index.documents.filter(doc =>
      doc.meta.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Get related documents based on shared tags
   */
  getRelatedDocuments(documentId: string, limit = 5): Document[] {
    const doc = this.getDocumentById(documentId);
    if (!doc || doc.meta.tags.length === 0) {
      return [];
    }

    const docTags = new Set(doc.meta.tags);
    
    return this.index.documents
      .filter(d => d.id !== documentId)
      .map(d => ({
        doc: d,
        sharedTags: d.meta.tags.filter(tag => docTags.has(tag)).length
      }))
      .filter(result => result.sharedTags > 0)
      .sort((a, b) => b.sharedTags - a.sharedTags)
      .slice(0, limit)
      .map(result => result.doc);
  }

  /**
   * List all unique tags in the index
   */
  getAllTags(): Array<{ tag: string; count: number }> {
    const tagCounts = new Map<string, number>();
    
    this.index.documents.forEach(doc => {
      doc.meta.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }
}
```

### 3. MCP Server Implementation

Implement the MCP server with tools and resources:

```typescript
// src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { IndexLoader } from './index-loader.js';
import { SearchEngine } from './search-engine.js';

class DocsSearchMCPServer {
  private server: Server;
  private indexLoader: IndexLoader;
  private searchEngine: SearchEngine | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'dbt-docs-search',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.indexLoader = new IndexLoader();
    this.setupHandlers();
  }

  private async ensureInitialized() {
    if (!this.searchEngine) {
      const index = await this.indexLoader.loadIndex();
      this.searchEngine = new SearchEngine(index);
    }
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_docs',
          description: 'Search the dbt documentation',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results (default: 10)',
                default: 10,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_document',
          description: 'Get a specific document by ID or URL',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Document ID',
              },
              url: {
                type: 'string',
                description: 'Document URL',
              },
            },
          },
        },
        {
          name: 'get_related_docs',
          description: 'Get documents related to a specific document',
          inputSchema: {
            type: 'object',
            properties: {
              documentId: {
                type: 'string',
                description: 'Document ID',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results (default: 5)',
                default: 5,
              },
            },
            required: ['documentId'],
          },
        },
        {
          name: 'list_tags',
          description: 'List all available tags in the documentation',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await this.ensureInitialized();

      switch (request.params.name) {
        case 'search_docs': {
          const { query, limit = 10 } = request.params.arguments as any;
          const results = this.searchEngine!.search(query, limit);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        }

        case 'get_document': {
          const { id, url } = request.params.arguments as any;
          const doc = id
            ? this.searchEngine!.getDocumentById(id)
            : this.searchEngine!.getDocumentByUrl(url);
          
          if (!doc) {
            throw new Error('Document not found');
          }
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(doc, null, 2),
              },
            ],
          };
        }

        case 'get_related_docs': {
          const { documentId, limit = 5 } = request.params.arguments as any;
          const related = this.searchEngine!.getRelatedDocuments(documentId, limit);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(related, null, 2),
              },
            ],
          };
        }

        case 'list_tags': {
          const tags = this.searchEngine!.getAllTags();
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(tags, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      await this.ensureInitialized();
      const index = this.indexLoader.getIndex()!;
      
      return {
        resources: index.documents.map(doc => ({
          uri: `doc://${doc.id}`,
          name: doc.title,
          description: doc.description,
          mimeType: 'text/plain',
        })),
      };
    });

    // Read specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      await this.ensureInitialized();
      
      const uri = request.params.uri;
      const docId = uri.replace('doc://', '');
      const doc = this.searchEngine!.getDocumentById(docId);
      
      if (!doc) {
        throw new Error(`Document not found: ${docId}`);
      }
      
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `# ${doc.title}\n\n${doc.description}\n\n${doc.content}`,
          },
        ],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('dbt Docs Search MCP Server running on stdio');
  }
}

// Start the server
const server = new DocsSearchMCPServer();
server.run().catch(console.error);
```

### 4. Package Configuration

```json
{
  "name": "dbt-docs-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for dbt documentation search",
  "type": "module",
  "main": "dist/server.js",
  "bin": {
    "dbt-docs-mcp": "./dist/server.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx src/server.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "node-fetch": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

## Deployment Workflow

### 1. Documentation Site Build

When changes are made to documentation:

```bash
cd docs.getdbt.com/website
npm run build
```

This generates `build/search-index.json`

### 2. Automatic Deployment

On Vercel/Netlify, the search index is automatically deployed with the site:
- Available at: `https://docs.getdbt.com/search-index.json`

### 3. MCP Server Updates

The MCP server automatically:
1. Fetches the latest index on startup
2. Caches it locally for 1 hour
3. Refetches when cache expires

## Testing

### Test the Search Index

```bash
cd website/plugins/buildSearchIndex
node example-usage.js
```

### Test the MCP Server

```bash
cd mcp-server
npm run dev
```

Then use an MCP client to test the tools.

## Best Practices

1. **Caching**: Implement proper caching to avoid excessive requests
2. **Error Handling**: Handle network failures gracefully
3. **Rate Limiting**: Consider rate limiting if index is large
4. **Monitoring**: Log search queries and performance metrics
5. **Versioning**: Use the index version field to handle breaking changes

## Future Enhancements

- **Semantic Search**: Add vector embeddings for semantic search
- **Streaming**: Stream large documents instead of loading entirely
- **Incremental Updates**: Only fetch changed documents
- **A/B Testing**: Test different ranking algorithms
- **Analytics**: Track which documents are most useful

