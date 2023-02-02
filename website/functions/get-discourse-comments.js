const axios = require('axios')

const { DISCOURSE_DEVBLOG_API_KEY , DISCOURSE_USER_SYSTEM } = process.env
const DEVBLOG_URL = 'https://docs.getdbt.com/blog/'
const DISCOURSE_TOPIC_ID = 2
const DISCOURSE_EXTERNAL_ID_SUFFIX = '-testing3'

// Set API endpoint and headers
let discourse_endpoint = `https://discourse.getdbt.com`
let headers = {
  'Accept': 'application/json',
  'Api-Key': DISCOURSE_DEVBLOG_API_KEY,
  'Api-Username': DISCOURSE_USER_SYSTEM,
}    

async function getDiscourseComments(event) {
  let topicId, comments;

  try {
    postTitle = event.queryStringParameters.title;
    postSlug = event.queryStringParameters.slug;
    externalId = truncateString(`${postSlug}${DISCOURSE_EXTERNAL_ID_SUFFIX}`)

    if (!postSlug) throw new Error("Unable to query Discourse API. Error reading slug.");

    topicId = await searchDiscourseExternalId(externalId);

    // First check if the dev blog post exists in Discourse
    // Get the comments if it does
    if (typeof topicId === "number") {
      comments = await getDiscourseTopicbyID(topicId);
    } else {
      // If the dev blog post does not exist in Discourse
      // Create a new topic and get the comments
      topicId = await createDiscourseTopic(postTitle, externalId, postSlug);
      if (typeof topicId === "number") {
        comments = await getDiscourseTopicbyID(topicId);
        comments.shift();
        comments = { topicId, comments };

        return await returnResponse(200, comments);
      } else {
        return await returnResponse(500, {
          error: "Unable to create Discourse topic TopicID is not a number.",
        });
      }
    }

    comments.shift();
    comments = { topicId, comments };

    return await returnResponse(200, comments);
  } catch (err) {
    console.log("err", err);
    return await returnResponse(500, {error: "Unable to get topics from Discourse."});
  }
}

async function createDiscourseTopic(title, externalId, slug) {
    console.log(`No topics found. Creating a new topic in Discourse - ${title}`)
    try  {
        const response = await axios.post(`${discourse_endpoint}/posts`, {
            title: title,
            raw: `This is a companion discussion topic for the original entry at ${DEVBLOG_URL}${slug}`,
            category: DISCOURSE_TOPIC_ID,
            embed_url: `${DEVBLOG_URL}${slug}`,
            external_id: externalId,
            tags: ['devblog'],
            visible: false
        }, { headers })

        let topicId = await response.data.topic_id

        console.log('Topic successfully created with topic_id', topicId)

        return topicId
    
    } catch(err) {
        console.log('err', err.response)
        return await returnResponse(500, { error: 'Unable to create Discourse topic.'})
    }
}

async function getDiscourseTopicbyID(topicId) {
    console.log(`Topic found setting topic id - ${topicId}`)
    try {
        let response = await axios.get(`${discourse_endpoint}/t/${topicId}.json`, { headers })
        let { data } = await response
        let post_stream = data.post_stream
        let post_count = data.posts_count

        // If there is more than one comment make the topic visibile in Discourse
        if (post_count > 1 && data.visible === false) {
            console.log(`Topic has more than one comment. Changing visibility to visible.`)
            await axios.put(`${discourse_endpoint}/t/${topicId}`, {
                visible: true
            }, { headers })
        }

        // Filter only 'regular' posts in Discourse. (e.g. not moderator actions, small_actions, whispers)
        post_stream.posts = post_stream.posts.filter(post => post.post_type === 1)
        
        return post_stream.posts
    } catch(err) {
        console.log('err', err.response)
        return await returnResponse(500, { error: 'Unable to get Discourse topic by ID.'})
    }
}

async function searchDiscourseExternalId(externalId) {
    console.log(`Searching for external_id in Discourse - ${externalId}`);
    try {
        const data = await axios.get(`${discourse_endpoint}/t/external_id/${externalId}.json`, { headers });
        return data.data.id;
    } catch (err) {
        return await returnResponse(500, { error: 'Unable to search Discourse topics.' });
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

function truncateString(str) {
    if (str.length <= 50) {
        return str
    }
    return str.slice(str.length - 50, str.length)
}


exports.handler = getDiscourseComments
