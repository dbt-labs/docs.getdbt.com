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


async function getDiscourseTopics( event ) {

  try {

    let postTitle = event.queryStringParameters.title.trim() || ''
    let postSlug = event.queryStringParameters.slug || ''
    let postTitleEncoded = encodeURIComponent(postTitle)

    if(!postTitle) throw new Error('Unable to query Discourse API.')

    let topics = await searchDiscourseTopics(postTitleEncoded)
    
    let allTopics = topics
    let allTopicTitles = []
    let topicExists = false
    
    let topicId

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
        createDiscourseTopic(postTitle, postSlug)
    
        return await returnResponse(200, { comments: [] })

    } else {
        // Else return the posts for that specific topic

        // Set topicId to the result from allTopics that matches the postTitle
        allTopics.forEach(topic => {
            if(topic.title === postTitle) {
                topicId = topic.id
            }
        })

        let comments = await getDiscourseTopicbyID(topicId)
        
        // Return comments
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

    let { data: { post_stream } } = await axios.get(`${discourse_endpoint}/t/${topicId}.json`, { headers })
    return post_stream.posts
}

async function searchDiscourseTopics(title) {
    console.log(`Searching for topic in Discourse - ${title}`)

    let { data: { topics } } = await axios.get(`${discourse_endpoint}/search?q=${title}&in:title`, { headers })
    return topics
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
