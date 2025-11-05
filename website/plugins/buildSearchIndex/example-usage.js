/**
 * Example: How to use the generated search index
 * 
 * This demonstrates various ways to query and use the search index
 * that would be useful for an MCP server implementation.
 */

const fs = require('fs');
const path = require('path');

// Load the search index
function loadSearchIndex(indexPath = '../../build/search-index.json') {
  const fullPath = path.resolve(__dirname, indexPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(content);
}

// Example 1: Simple text search
function searchByText(index, query) {
  const lowerQuery = query.toLowerCase();
  
  return index.documents.filter(doc => {
    const searchableText = `${doc.title} ${doc.description} ${doc.content}`.toLowerCase();
    return searchableText.includes(lowerQuery);
  });
}

// Example 2: Search by title only
function searchByTitle(index, query) {
  const lowerQuery = query.toLowerCase();
  
  return index.documents.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery)
  );
}

// Example 3: Search by tags
function searchByTag(index, tag) {
  return index.documents.filter(doc => 
    doc.meta.tags && doc.meta.tags.includes(tag)
  );
}

// Example 4: Get document by ID
function getDocumentById(index, id) {
  return index.documents.find(doc => doc.id === id);
}

// Example 5: Get document by URL
function getDocumentByUrl(index, url) {
  return index.documents.find(doc => doc.url === url);
}

// Example 6: Fuzzy search with scoring
function fuzzySearch(index, query, limit = 10) {
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter(term => term.length > 2);
  
  const scored = index.documents.map(doc => {
    let score = 0;
    const lowerTitle = doc.title.toLowerCase();
    const lowerDescription = doc.description.toLowerCase();
    const lowerContent = doc.content.toLowerCase();
    
    queryTerms.forEach(term => {
      // Exact match in title = high score
      if (lowerTitle === term) score += 100;
      else if (lowerTitle.includes(term)) score += 50;
      
      // Match in description = medium score
      if (lowerDescription.includes(term)) score += 20;
      
      // Match in content = low score
      if (lowerContent.includes(term)) score += 5;
      
      // Match in tags
      if (doc.meta.tags && doc.meta.tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 30;
      }
    });
    
    return { doc, score };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);
  
  return scored.map(result => ({
    ...result.doc,
    _score: result.score,
  }));
}

// Example 7: Get related documents by shared tags
function getRelatedDocuments(index, documentId, limit = 5) {
  const doc = getDocumentById(index, documentId);
  
  if (!doc || !doc.meta.tags || doc.meta.tags.length === 0) {
    return [];
  }
  
  const docTags = new Set(doc.meta.tags);
  
  return index.documents
    .filter(d => d.id !== documentId)
    .map(d => {
      const sharedTags = d.meta.tags 
        ? d.meta.tags.filter(tag => docTags.has(tag)).length 
        : 0;
      return { doc: d, sharedTags };
    })
    .filter(result => result.sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, limit)
    .map(result => result.doc);
}

// Example 8: Get statistics about the index
function getIndexStats(index) {
  const totalDocs = index.count;
  const totalContent = index.documents.reduce((sum, doc) => sum + doc.content.length, 0);
  const avgContentLength = Math.round(totalContent / totalDocs);
  
  const tagsCount = {};
  index.documents.forEach(doc => {
    if (doc.meta.tags) {
      doc.meta.tags.forEach(tag => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    }
  });
  
  const topTags = Object.entries(tagsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return {
    version: index.version,
    generated: index.generated,
    totalDocuments: totalDocs,
    totalContentSize: totalContent,
    averageContentLength: avgContentLength,
    topTags: topTags.map(([tag, count]) => ({ tag, count })),
  };
}

// Example usage
if (require.main === module) {
  try {
    console.log('Loading search index...\n');
    const index = loadSearchIndex();
    
    console.log('=== Index Statistics ===');
    const stats = getIndexStats(index);
    console.log(`Version: ${stats.version}`);
    console.log(`Generated: ${stats.generated}`);
    console.log(`Total Documents: ${stats.totalDocuments}`);
    console.log(`Average Content Length: ${stats.averageContentLength} characters`);
    console.log(`\nTop Tags:`);
    stats.topTags.forEach(({ tag, count }) => {
      console.log(`  - ${tag}: ${count} documents`);
    });
    
    console.log('\n=== Example: Search by Text ===');
    const results = searchByText(index, 'dbt installation');
    console.log(`Found ${results.length} results for "dbt installation"`);
    results.slice(0, 3).forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.title}`);
      console.log(`   URL: ${doc.url}`);
      console.log(`   Description: ${doc.description.substring(0, 100)}...`);
    });
    
    console.log('\n=== Example: Fuzzy Search ===');
    const fuzzyResults = fuzzySearch(index, 'getting started dbt', 5);
    console.log(`Top 5 results for "getting started dbt":`);
    fuzzyResults.forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.title} (score: ${doc._score})`);
      console.log(`   URL: ${doc.url}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nMake sure to run "npm run build" first to generate the search index.');
  }
}

module.exports = {
  loadSearchIndex,
  searchByText,
  searchByTitle,
  searchByTag,
  getDocumentById,
  getDocumentByUrl,
  fuzzySearch,
  getRelatedDocuments,
  getIndexStats,
};

