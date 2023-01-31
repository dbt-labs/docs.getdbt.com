const axios = require('axios')

const { DISCOURSE_DEVBLOG_API_KEY , DISCOURSE_USER_SYSTEM } = process.env
const DEVBLOG_URL = 'https://docs.getdbt.com/blog/'
const DISCOURSE_TOPIC_ID = 2
const DISCOURSE_EXTERNAL_ID_SUFFIX = '-testing2'

// Set API endpoint and headers
let discourse_endpoint = `https://discourse.getdbt.com`
let headers = {
  'Accept': 'application/json',
  'Api-Key': DISCOURSE_DEVBLOG_API_KEY,
  'Api-Username': DISCOURSE_USER_SYSTEM,
}    

async function getDiscourseComments(event) {
  let postTitle, postSlug, topicId, comments;

  try {
    postTitle = event.queryStringParameters.title.trim();
    postSlug = event.queryStringParameters.slug;

    if (!postSlug) throw new Error("Unable to query Discourse API.");

    topicId = await searchDiscourseExternalId(postSlug);

    // First check if the dev blog post exists in Discourse
    // Get the comments if it does
    if (typeof topicId === "number") {
      comments = await getDiscourseTopicbyID(topicId);
    } else {
      // If the dev blog post does not exist in Discourse
      // Create a new topic and get the comments
      topicId = await createDiscourseTopic(postTitle, postSlug);
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

async function createDiscourseTopic(title, slug) {
    console.log(`No topics found. Creating a new topic in Discourse - ${title}`)

    try  {
        const response = await axios.post(`${discourse_endpoint}/posts`, {
            title: title,
            raw: `This is a companion discussion topic for the original entry at ${DEVBLOG_URL}${slug}`,
            category: DISCOURSE_TOPIC_ID,
            embed_url: `${DEVBLOG_URL}${slug}`,
            external_id: `${slug}${DISCOURSE_EXTERNAL_ID_SUFFIX}`
        }, { headers })

        let topicId = await response.data.topic_id

        console.log('Topic successfully created with topic_id', topicId)
        console.log(response)

        return topicId
    
    } catch(err) {
        console.log('err', err.response)
        return await returnResponse(500, { error: 'Unable to create Discourse topic.'})
    }
}

async function getDiscourseTopicbyID(topicId) {
    console.log(`Topic found setting topic id - ${topicId}`)
    try {
        let { data: { post_stream } } = await axios.get(`${discourse_endpoint}/t/${topicId}.json`, { headers })
        return post_stream.posts
    } catch(err) {
        console.log('err', err.response)
        return await returnResponse(500, { error: 'Unable to get Discourse topic by ID.'})
    }
}

async function searchDiscourseExternalId(slug) {
    console.log(`Searching for external_id in Discourse - ${slug}${DISCOURSE_EXTERNAL_ID_SUFFIX}`);
    try {
        const data = await axios.get(`${discourse_endpoint}/t/external_id/${slug}${DISCOURSE_EXTERNAL_ID_SUFFIX}.json`, { headers });
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

exports.handler = getDiscourseComments
