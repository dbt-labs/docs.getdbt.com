const algoliasearch = require('algoliasearch')
const axios = require('axios')
const { schedule } = require('@netlify/functions');

async function updateAlgolia() {
  // Get envs
  const { ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY, ALGOLIA_INDEX_NAME, URL, DISCOURSE_API_KEY , DISCOURSE_USER } = process.env

  try {
    const discourseSearchEndpoint = `${URL}/.netlify/functions/get-discourse-topics`
    const discourseTagsEndpoint = `https://discourse.getdbt.com/tags.json`
    const discourseHeaders = {
      'Accept': 'application/json',
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': DISCOURSE_USER,
    }
    // Get Discourse topics from endpoint
    // This uses same function as DiscourseFeed component
    const helpTopic = {
      status: 'solved',
      category: 'help',
      order: 'latest_topic'
    }
    const discussionsTopic = {
      category: 'discussions',
      order: 'latest_topic'
    }
    const showAndTellTopic = {
      category: 'show-and-tell',
      order: 'latest_topic'
    }
    
    // Get all data and merge into 1 array
    const allDiscourseData = await Promise.all([
      axios.post(discourseSearchEndpoint, helpTopic),
      axios.post(discourseSearchEndpoint, discussionsTopic),
      axios.post(discourseSearchEndpoint, showAndTellTopic),
      axios.get(discourseTagsEndpoint, { discourseHeaders })
    ])
    if(!allDiscourseData) throw new Error('Unable to get Discourse topics.')

    // Build array of Discourse data ready for Algolia    
    const discourseTopics = allDiscourseData?.reduce((topicArr, group) => {
      const objConsts = {
        type: 'lvl1',
        language: 'en',
        docusaurus_tag: 'docs-default-current',
        weight: {
          pageRank: '0',
          level: 1,
        }
      }
      if(group?.data?.tags?.length > 0) {
        group.data.tags.map(tag => {
          const tagObj = objConsts

          tagObj.objectID = `discourse-tag-${tag.id}`
          tagObj.hierarchy = {
            lvl0: 'dbt Community Forum Tags',
            lvl1: tag?.name ? tag.name : tag.id,
          }
          tagObj.url = `https://discourse.getdbt.com/tag/${tag.id}`
          tagObj.weight.position = 92

          topicArr.push(tagObj)
        })
      } else if(group?.data?.length > 0) {
        group.data.map(topic => {
          if(topic?.id && topic?.slug && topic?.category_id) {
            const topicObj = objConsts

            topicObj.objectID = `discourse-${topic.id}`
            topicObj.hierarchy = {
              lvl0: topic?.category_id === 19 
                ? 'dbt Community Forum Q&A' 
                : 'dbt Community Forum Discussions',
              lvl1: topic.title,
            }
            topicObj.url = `https://discourse.getdbt.com/t/${topic.slug}/${topic.id}`
            topicObj.weight.position = topic?.category_id === 19 
              ? 90
              : 91

            topicArr.push(topicObj)
          }
        })
      }
      return topicArr
    }, [])

    if(!discourseTopics) throw new Error('Unable to build topics array from Discourse data.')

    // Test by sending only 1 Discourse topic
    // into Algolia before sending all.
    const tempTopicsArr = discourseTopics[0]
    console.log('tempTopicsArr', tempTopicsArr)

    // // Ready to initialize Algolia
    // const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY);
    // const index = client.initIndex(ALGOLIA_INDEX_NAME);

    // // Send data to Algolia
    // const { objectIDs } = await index.saveObjects(tempTopicsArr, {
    //   autoGenerateObjectIDIfNotExist: true
    // })
    // console.log('Updated Algolia records:', objectIDs)
 
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

exports.handler = schedule('@weekly', updateAlgolia)
