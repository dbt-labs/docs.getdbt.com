const algoliasearch = require('algoliasearch')
const axios = require('axios')

async function updateAlgolia() {
  // Get envs
  const { ALGOLIA_TEST_APP_ID, ALGOLIA_TEST_WRITE_API_KEY, ALGOLIA_DISCOURSE_INDEX_NAME, URL } = process.env

  try {
    // Get topics up to 30 days back
    let today = new Date();
    const relativeDate = new Date(today.setDate(today.getDate() - 30));
    const afterDate = `${relativeDate.getFullYear()}-${('0'+ (relativeDate.getMonth()+1)).slice(-2)}-${('0'+ relativeDate.getDate()).slice(-2)}`
    
    // Get Discourse topics with the following data:
    const topicData = {
      status: 'solved',
      category: 'help',
      order: 'latest_topic'
    }
    afterDate && (topicData.after = afterDate) 
    
    // Get Discourse topics from endpoint
    // This uses same function as DiscourseFeed component
    const { data } = await axios.post(`${URL}/.netlify/functions/get-discourse-topics`, topicData)
    if(!data) throw new Error('Unable to get Discourse topics.')

    // Build array of Discourse data ready for Algolia    
    const discourseTopics = data?.reduce((topicArr, topic, i) => {
      if(topic?.id && topic?.slug) {
        const topicObj = {
          objectID: `discourse-${topic.id}`,
          type: 'lvl1',
          hierarchy: {
            lvl0: 'Discourse',
            lvl1: topic.title,
          },
          url: `https://discourse.getdbt.com/t/${topic.slug}/${topic.id}`,
          language: 'en',
          docusaurus_tag: 'docs-default-current',
        }
        topicArr.push(topicObj)
      }
      return topicArr
    }, [])

    if(!discourseTopics) throw new Error('Unable to build topics array from Discourse data.')

    // Ready to initialize Algolia
    const client = algoliasearch(ALGOLIA_TEST_APP_ID, ALGOLIA_TEST_WRITE_API_KEY);
    const index = client.initIndex(ALGOLIA_DISCOURSE_INDEX_NAME);

    // Send data to Algolia
    const { objectIDs } = await index.saveObjects(discourseTopics, {
      autoGenerateObjectIDIfNotExist: true
    })
    console.log('Updated Algolia records:', objectIDs)
 
    return {
      statusCode: 200
    }
  } catch(err) {
    console.log(err)
    return {
      statusCode: 500
    }
  }
}

exports.handler = updateAlgolia

