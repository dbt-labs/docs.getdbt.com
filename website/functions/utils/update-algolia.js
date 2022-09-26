const algoliasearch = require('algoliasearch')
const axios = require('axios')

async function updateAlgolia() {
  const { ALGOLIA_TEST_APP_ID, ALGOLIA_TEST_API_KEY, ALGOLIA_DISCOURSE_INDEX_NAME, URL } = process.env

  // Get topics up to 30 days back
  let today = new Date();
  const relativeDate = new Date(today.setDate(today.getDate() - 30));
  const afterDate = `${relativeDate.getFullYear()}-${('0'+ (relativeDate.getMonth()+1)).slice(-2)}-${('0'+ relativeDate.getDate()).slice(-2)}`

  const topicData = {
    status: 'solved',
    category: 'help',
    order: 'latest_topic'
  }
  afterDate && (topicData.after = afterDate) 
  
  const { data } = await axios.post(`${URL}/.netlify/functions/get-discourse-topics`, topicData)
  console.log('data', data)

  const client = algoliasearch(ALGOLIA_TEST_APP_ID, ALGOLIA_TEST_API_KEY);
  const index = client.initIndex(ALGOLIA_DISCOURSE_INDEX_NAME);
  
  const objects = [
    {
      objectID: 1,
      type: 'lvl1',
      hierarchy: {
        lvl0: 'Test',
        lvl1: "FooBarz",
      },
      url: 'https://discourse.getdbt.com/tag/testing',
      language: 'en',
      docusaurus_tag: 'docs-default-current',
    },
    {
      objectID: 2,
      type: 'lvl1',
      hierarchy: {
        lvl0: 'Discourse',
        lvl1: "Test Record",
      },
      url: 'https://discourse.getdbt.com/tag/seeds',
      language: 'en',
      docusaurus_tag: 'docs-default-current',
    },
  ];
  
  try {
    // Send data to Algolia
    // const test = await index.saveObjects(objects, {
    //   autoGenerateObjectIDIfNotExist: true
    // })
    // console.log('test', test)

    // const res = await index.search('Foo')
    // console.log('res', res)
  } catch(err) {
    console.log(err)
  }
}

module.exports = updateAlgolia

