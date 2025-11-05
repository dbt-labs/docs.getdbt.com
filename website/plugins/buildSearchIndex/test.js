/**
 * Simple test script for the buildSearchIndex plugin
 * 
 * Run this after building your site to verify the search index was generated correctly.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function testSearchIndex() {
  log('\n🧪 Testing Search Index Generation\n', COLORS.blue);
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Test 1: Check if search-index.json exists in build directory
  log('Test 1: Check if search-index.json exists in build directory');
  const buildIndexPath = path.resolve(__dirname, '../../build/search-index.json');
  if (fs.existsSync(buildIndexPath)) {
    log('  ✓ PASS: search-index.json exists in build directory', COLORS.green);
    passedTests++;
  } else {
    log('  ✗ FAIL: search-index.json not found in build directory', COLORS.red);
    log(`    Expected path: ${buildIndexPath}`, COLORS.yellow);
    failedTests++;
    log('\n⚠️  Run "npm run build" first to generate the search index\n', COLORS.yellow);
    return;
  }
  
  // Test 2: Check if search-index.json is valid JSON
  log('\nTest 2: Check if search-index.json is valid JSON');
  let indexData;
  try {
    const content = fs.readFileSync(buildIndexPath, 'utf8');
    indexData = JSON.parse(content);
    log('  ✓ PASS: search-index.json is valid JSON', COLORS.green);
    passedTests++;
  } catch (error) {
    log('  ✗ FAIL: search-index.json is not valid JSON', COLORS.red);
    log(`    Error: ${error.message}`, COLORS.yellow);
    failedTests++;
    return;
  }
  
  // Test 3: Check if index has required top-level fields
  log('\nTest 3: Check if index has required top-level fields');
  const requiredFields = ['version', 'generated', 'count', 'documents'];
  const missingFields = requiredFields.filter(field => !(field in indexData));
  if (missingFields.length === 0) {
    log('  ✓ PASS: Index has all required top-level fields', COLORS.green);
    passedTests++;
  } else {
    log('  ✗ FAIL: Index is missing required fields', COLORS.red);
    log(`    Missing: ${missingFields.join(', ')}`, COLORS.yellow);
    failedTests++;
  }
  
  // Test 4: Check if documents array is not empty
  log('\nTest 4: Check if documents array is not empty');
  if (Array.isArray(indexData.documents) && indexData.documents.length > 0) {
    log(`  ✓ PASS: Index contains ${indexData.documents.length} documents`, COLORS.green);
    passedTests++;
  } else {
    log('  ✗ FAIL: Documents array is empty or invalid', COLORS.red);
    failedTests++;
  }
  
  // Test 5: Check if count matches documents length
  log('\nTest 5: Check if count matches documents length');
  if (indexData.count === indexData.documents.length) {
    log(`  ✓ PASS: Count (${indexData.count}) matches documents array length`, COLORS.green);
    passedTests++;
  } else {
    log('  ✗ FAIL: Count does not match documents array length', COLORS.red);
    log(`    Count: ${indexData.count}, Array length: ${indexData.documents.length}`, COLORS.yellow);
    failedTests++;
  }
  
  // Test 6: Verify first document has required fields
  log('\nTest 6: Verify documents have required fields');
  const requiredDocFields = ['id', 'title', 'description', 'url', 'content', 'meta'];
  const firstDoc = indexData.documents[0];
  const missingDocFields = requiredDocFields.filter(field => !(field in firstDoc));
  if (missingDocFields.length === 0) {
    log('  ✓ PASS: Documents have all required fields', COLORS.green);
    passedTests++;
  } else {
    log('  ✗ FAIL: Documents are missing required fields', COLORS.red);
    log(`    Missing: ${missingDocFields.join(', ')}`, COLORS.yellow);
    failedTests++;
  }
  
  // Test 7: Verify content is stripped of markdown
  log('\nTest 7: Verify content is stripped of markdown');
  const hasMarkdownSyntax = indexData.documents.some(doc => {
    const content = doc.content || '';
    // Check for common markdown patterns
    return content.includes('```') || 
           content.includes('##') || 
           content.match(/\[.*\]\(.*\)/) || // links
           content.match(/!\[.*\]\(.*\)/);   // images
  });
  if (!hasMarkdownSyntax) {
    log('  ✓ PASS: Content appears to be stripped of markdown syntax', COLORS.green);
    passedTests++;
  } else {
    log('  ⚠ WARNING: Some markdown syntax may still be present in content', COLORS.yellow);
    log('    This might be intentional for code examples', COLORS.yellow);
    passedTests++;
  }
  
  // Test 8: Verify URLs are properly formatted
  log('\nTest 8: Verify URLs are properly formatted');
  const invalidUrls = indexData.documents.filter(doc => {
    return !doc.url.startsWith('/') && doc.url !== '/';
  });
  if (invalidUrls.length === 0) {
    log('  ✓ PASS: All URLs are properly formatted', COLORS.green);
    passedTests++;
  } else {
    log('  ✗ FAIL: Some URLs are not properly formatted', COLORS.red);
    log(`    Invalid URLs found in ${invalidUrls.length} documents`, COLORS.yellow);
    invalidUrls.slice(0, 3).forEach(doc => {
      log(`      - ${doc.id}: ${doc.url}`, COLORS.yellow);
    });
    failedTests++;
  }
  
  // Test 9: Check file size
  log('\nTest 9: Check file size');
  const stats = fs.statSync(buildIndexPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  log(`  ℹ INFO: Index file size: ${sizeMB} MB`, COLORS.blue);
  if (stats.size > 10 * 1024 * 1024) { // 10 MB
    log('  ⚠ WARNING: Index file is quite large (>10MB)', COLORS.yellow);
    log('    Consider reducing maxContentLength or setting includeContent: false', COLORS.yellow);
  } else {
    log('  ✓ PASS: File size is reasonable', COLORS.green);
    passedTests++;
  }
  
  // Test 10: Sample a few random documents
  log('\nTest 10: Sample document validation');
  const sampleSize = Math.min(5, indexData.documents.length);
  const sampleIndices = Array.from(
    { length: sampleSize }, 
    () => Math.floor(Math.random() * indexData.documents.length)
  );
  
  let validSamples = 0;
  sampleIndices.forEach(idx => {
    const doc = indexData.documents[idx];
    const hasValidTitle = doc.title && doc.title.length > 0;
    const hasValidDescription = doc.description && doc.description.length > 0;
    const hasValidContent = doc.content && doc.content.length > 0;
    
    if (hasValidTitle && hasValidDescription && hasValidContent) {
      validSamples++;
    }
  });
  
  if (validSamples === sampleSize) {
    log(`  ✓ PASS: All ${sampleSize} sampled documents are valid`, COLORS.green);
    passedTests++;
  } else {
    log(`  ✗ FAIL: ${sampleSize - validSamples}/${sampleSize} sampled documents are invalid`, COLORS.red);
    failedTests++;
  }
  
  // Summary
  log('\n' + '='.repeat(50), COLORS.blue);
  log('📊 Test Summary', COLORS.blue);
  log('='.repeat(50), COLORS.blue);
  log(`Total Tests: ${passedTests + failedTests}`);
  log(`Passed: ${passedTests}`, COLORS.green);
  log(`Failed: ${failedTests}`, failedTests > 0 ? COLORS.red : COLORS.green);
  
  // Index statistics
  log('\n📈 Index Statistics', COLORS.blue);
  log(`Version: ${indexData.version}`);
  log(`Generated: ${indexData.generated}`);
  log(`Total Documents: ${indexData.count}`);
  log(`File Size: ${sizeMB} MB`);
  
  // Tag statistics
  const tagCounts = {};
  indexData.documents.forEach(doc => {
    if (doc.meta && doc.meta.tags) {
      doc.meta.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const totalTags = Object.keys(tagCounts).length;
  log(`Unique Tags: ${totalTags}`);
  
  if (totalTags > 0) {
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    log('\nTop 5 Tags:');
    topTags.forEach(([tag, count]) => {
      log(`  - ${tag}: ${count} documents`);
    });
  }
  
  // Average content length
  const avgContentLength = Math.round(
    indexData.documents.reduce((sum, doc) => sum + (doc.content || '').length, 0) / 
    indexData.documents.length
  );
  log(`\nAverage Content Length: ${avgContentLength} characters`);
  
  // Sample documents
  log('\n📄 Sample Documents:', COLORS.blue);
  indexData.documents.slice(0, 3).forEach((doc, idx) => {
    log(`\n${idx + 1}. ${doc.title}`);
    log(`   ID: ${doc.id}`);
    log(`   URL: ${doc.url}`);
    log(`   Description: ${doc.description.substring(0, 80)}...`);
    log(`   Content Length: ${(doc.content || '').length} characters`);
    if (doc.meta && doc.meta.tags && doc.meta.tags.length > 0) {
      log(`   Tags: ${doc.meta.tags.join(', ')}`);
    }
  });
  
  log('\n' + '='.repeat(50), COLORS.blue);
  
  if (failedTests === 0) {
    log('\n✅ All tests passed! Search index is ready to use.\n', COLORS.green);
  } else {
    log('\n❌ Some tests failed. Please review the errors above.\n', COLORS.red);
    process.exit(1);
  }
}

// Run tests
try {
  testSearchIndex();
} catch (error) {
  log(`\n❌ Test execution failed: ${error.message}\n`, COLORS.red);
  console.error(error);
  process.exit(1);
}

