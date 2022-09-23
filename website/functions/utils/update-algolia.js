const algoliasearch = require("algoliasearch");

async function updateAlgolia(topics) {
  const { ALGOLIA_TEST_APP_ID, ALGOLIA_TEST_API_KEY, ALGOLIA_DISCOURSE_INDEX_NAME } = process.env
  
  const client = algoliasearch(ALGOLIA_TEST_APP_ID, ALGOLIA_TEST_API_KEY);
  const index = client.initIndex(ALGOLIA_DISCOURSE_INDEX_NAME);
  
  // console.log('ALGOLIA_TEST_APP_ID', ALGOLIA_TEST_APP_ID)
  // console.log('ALGOLIA_TEST_API_KEY', ALGOLIA_TEST_API_KEY)
  // console.log('client', client)
  // console.log('index', index)
  const objects = [
    {
      objectID: 1,
      type: 'lvl1',
      hierarchy: {
        lvl0: 'Test',
        lvl1: "FooBarz",
      },
      url: 'url here',
      content: 'content here',
      language: 'en',
      docusaurus_tag: 'docs-default-current',
    }
  ];
  
  console.log('objects', objects)
  try {
    const test = await index.saveObjects(objects, {
      autoGenerateObjectIDIfNotExist: true
    })
    console.log('test', test)

    // const res = await index.search('Foo')
    // console.log('res', res)
  } catch(err) {
    console.log(err)
  }
}

module.exports = updateAlgolia
