const axios = require('axios')

async function getDiscourseTopics({ body, res }) {
  const { DISCOURSE_API_KEY , DISCOURSE_USER } = process.env

  console.log(body)

  try {
    // Set API endpoint and headers
    let discourse_endpoint = `https://discourse.getdbt.com`
    let headers = {
      'Accept': 'application/json',
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': DISCOURSE_USER,
    }

    const query = buildQueryString(body)
    if(!query) throw new Error('Unable to build query string.')

    console.log('Query String:', query)
    
    // Get topics from Discourse
    let { data: { posts, topics } } = await axios.get(`${discourse_endpoint}/search?q=${query}`, { headers })
    console.log('API Response:', posts, topics);

    // Return empty array if no topics found for search query
    // 200 status is used to prevent triggering Datadog alerts
    if(!topics || topics?.length <= 0) {
      // Log message with encoded query and end function
      console.log('Unable to get results from api request.')
      console.log(`Search query: ${query}`)
      return returnResponse(200, [])
    }

    // Set author and like_count for topics if not querying by specific term
    let allTopics = topics
    if(!body?.term) {
      allTopics = topics.reduce((topicsArr, topic) => {
        // Get first post in topic
        const firstTopicPost = posts?.find(post => 
          post?.post_number === 1 && 
          post?.topic_id === topic?.id
        )
        // If post found
        // Get username
        if(firstTopicPost?.username) {
          topic.author = firstTopicPost.username
        }
        // Get like count
        if(firstTopicPost?.like_count) {
          topic.like_count = firstTopicPost.like_count
        }

        if(firstTopicPost?.blurb) {
          topic.blurb = firstTopicPost.blurb
        }

        // Push updated topic to array
        topicsArr.push(topic)
          
        return topicsArr
      }, [])
    }

    // Return topics 
    //return await returnResponse(200, allTopics)
    return await res.status(200).json(allTopics)
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS' 
  }

  try {
    const resObj = {
      statusCode: status,
      headers,
      body: JSON.stringify(res)
    }
    console.log('Response Object:', resObj);

    return resObj;
  } catch (error) {
    console.error('Error:', error); 
    throw error;
  }
}

function buildQueryString(body) {
  if(!body) return null

  // start with empty query string
  let query = ''

  // check param and apply to query if set
  for(const [key, value] of Object.entries(JSON.parse(body))) {
    // validate categories
    // if valid, add to query string
    if(validateItem({ key, value })) {
      if(key === 'category') {
        query += `#${value} `
      } else if(key === 'inString') {
        query += `in:${value}`
      } else if(key === 'status' && Array.isArray(value)) {
        value?.map(item => {
          query += `${key}:${item} `
        })
      } else {
        query += `${key}:${value} `
      }
    }
  }

  if(query) {
    const encodedQuery = encodeURIComponent(query)
    return encodedQuery
  }
}

function validateItem({ key, value }) {
  // predefined Discourse values
  // https://docs.discourse.org/#tag/Search/operation/search
  const inStringValues = ['title', 'first', 'pinned', 'wiki']
  const orderValues = ['latest', 'likes', 'views', 'latest_topic']
  const statusValues = ['open', 'closed', 'public', 'archived', 'noreplies', 'single_user', 'solved', 'unsolved']

  // validate keys
  if(key === 'inString') {
    return inStringValues.includes(value)
      ? true
      : false
  } else if(key === 'order') {
    return orderValues.includes(value)
      ? true
      : false
  } else if(key === 'status') {
    if(Array.isArray(value)) {
      let isValid = true
      value?.map(item => {
        if(!statusValues.includes(item)) isValid = false
      })
      return isValid
    } else {
      return statusValues.includes(value)
        ? true
        : false
    }
  } else {
    return true
  }
}

module.exports = getDiscourseTopics
