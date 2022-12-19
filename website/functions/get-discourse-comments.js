const axios = require('axios')

const { DISCOURSE_DEVBLOG_API_KEY , DISCOURSE_USER_SYSTEM } = process.env
const DEVBLOG_URL = 'https://docs.getdbt.com/blog/'

// Set API endpoint and headers
let discourse_endpoint = `https://discourse.getdbt.com`
let headers = {
  'Accept': 'application/json',
  'Api-Key': DISCOURSE_DEVBLOG_API_KEY,
  'Api-Username': DISCOURSE_USER_SYSTEM,
}    

async function getDiscourseComments( event ) {
  try {
    let postTitle = event.queryStringParameters.title.trim()
    let postSlug = event.queryStringParameters.slug
    let postTitleEncoded = encodeURIComponent(postTitle)

    if(!postTitle) throw new Error('Unable to query Discourse API.')

    let topics = await searchDiscourseTopics(postTitleEncoded)
    
    let allTopics = topics
    let allTopicTitles = []
    let topicExists = false
    
    let topicId = null
    let comments = []

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

    // If it does not exist in Discourse, create a new topic
    if(!topicExists) {
        await createDiscourseTopic(postTitle, postSlug)

        topics = await searchDiscourseTopics(postTitleEncoded)

        if(topics && topics?.length > 0 ) {
            topicId = await getTopicId(topics, postTitle)
        }

        if(topicId) {
            comments = await getDiscourseTopicbyID(topicId)
        }
     
        // Remove the the first post of the comments array since it is not a comment
        if (comments.length) {
            comments.shift()
            comments = { topicId, comments }
        }

        return await returnResponse(200, comments)
    } else {
        // Set topicId to the result from allTopics that matches the postTitle
        topicId = await getTopicId(allTopics, postTitle)

        if(topicId) {
            comments = await getDiscourseTopicbyID(topicId)
        }

        // Remove the the first post of the comments array since it is not a comment
        if (comments.length) {
            comments.shift()
            comments = { topicId, comments }
        }

        return await returnResponse(200, comments)
    }

  } catch(err) {
    console.log('err', err)
    return await returnResponse(500, { error: 'Unable to get topics from Discourse.'})
  }
}

async function createDiscourseTopic(title, slug) {
    console.log(`No topics found. Creating a new topic in Discourse - ${title}`)

    try  {
        axios.post(`${discourse_endpoint}/posts`, {
            title: title,
            raw: `This is a companion discussion topic for the original entry at ${DEVBLOG_URL}${slug}`,
            category: 2
        }, { headers })
    
    } catch(err) {
        console.log('err', err)
        return await returnResponse(500, { error: 'Unable to create Discourse topic.'})
    }
}

async function getDiscourseTopicbyID(topicId) {
    console.log(`Topic found setting topic id - ${topicId}`)

    try {
        let { data: { post_stream } } = await axios.get(`${discourse_endpoint}/t/${topicId}.json`, { headers })
        return post_stream.posts
    } catch(err) {
        console.log('err', err)
        return await returnResponse(500, { error: 'Unable to get Discourse topic by ID.'})
    }
}

async function searchDiscourseTopics(title) {
    console.log(`Searching for topic in Discourse - ${title}`)

    try {
        let { data: { topics } } = await axios.get(`${discourse_endpoint}/search?q=${title}&in:title`, { headers })
        return topics
    } catch(err) {
        console.log('err', err)
        return await returnResponse(500, { error: 'Unable to search Discourse topics.'})
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

// make the forEach above a reusuable function
async function getTopicId(allTopics, postTitle) {
    allTopics.forEach(topic => {
        if(topic.title === postTitle) {
            topicId = topic.id
        }
    })

    return topicId
}

exports.handler = getDiscourseComments
