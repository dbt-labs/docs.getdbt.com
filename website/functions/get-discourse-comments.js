const axios = require('axios')

async function getDiscourseTopics( event ) {
  const { DISCOURSE_DEVBLOG_API_KEY , DISCOURSE_USER_SYSTEM } = process.env

  const DEVBLOG_URL = 'https://docs.getdbt.com/blog/'

  // Set API endpoint and headers
  let discourse_endpoint = `https://discourse.getdbt.com`
  let headers = {
    'Accept': 'application/json',
    'Api-Key': DISCOURSE_DEVBLOG_API_KEY,
    'Api-Username': DISCOURSE_USER_SYSTEM,
  }    



  try {

    let postTitle = event.queryStringParameters.title.trim() || ''
    let postSlug = event.queryStringParameters.slug || ''
    let postTitleEncoded = encodeURIComponent(postTitle)

    if(!postTitle) throw new Error('Unable to query Discourse API.')

    // Check if we have a topic from Discourse that matches the dev blog post title
    let { data: { topics } } = await axios.get(`${discourse_endpoint}/search?q=${postTitleEncoded}&in:title`, { headers })
    let allTopics = topics
    let allTopicTitles = []
    let topicExists = false

    // Return all the topic titles from Discourse
    if(topics && topics.length > 0 ) {
        allTopicTitles = allTopics.reduce((topicsArr, topic) => {
            topicsArr.push(topic.title)
            return topicsArr
        }, [])

        // Check to see if the Dev Blog post title matches any of the Discourse topic titles
        topicExists = allTopics.some(topic => topic.title === postTitle)
    }

    console.log('topicExists', topicExists)

    console.log('allTopics', allTopicTitles)


    // If it does not exist in Discourse, create a new topic
    if(!topicExists) {

        console.log('No topics found. Creating a new topic', postTitle)
        
        axios.post(`${discourse_endpoint}/posts`, {
            title: postTitle,
            raw: `This is a companion discussion topic for the original entry at ${DEVBLOG_URL}${postSlug}`,
            category: 2
        }, { headers })

        return await returnResponse(200, { message: 'No topics found. Creating a new topic in Discourse.' })

    } else {
        // Else return the posts for that specific topic
        let topicId 
        
        // set topicId to the result from allTopics that matches the postTitle
        allTopics.forEach(topic => {
            if(topic.title === postTitle) {
                topicId = topic.id
            }
        })

        console.log(`Topic found setting topic id - ${topicId}`,)

        // Get the comments for the specific topic via the topicId
        let { data: { post_stream } } = await axios.get(`${discourse_endpoint}/t/${topicId}.json`, { headers })
        
        // Return comments
        return await returnResponse(200, post_stream.posts)
    }

  } catch(err) {
    // Log and return the error
    console.log('err', err)
    return await returnResponse(500, { error: 'Unable to get topics from Discourse.'})
  }
}

async function returnResponse(status, res) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET' 
  }
  const resObj = {
    statusCode: status,
    headers,
    body: JSON.stringify(res)
  }
  return resObj
}

exports.handler = getDiscourseTopics
