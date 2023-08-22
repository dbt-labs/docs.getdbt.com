const axios = require('axios')
require("dotenv").config();

const { DISCOURSE_DEVBLOG_API_KEY , DISCOURSE_USER_SYSTEM } = process.env
const DEVBLOG_PROD_URL = 'https://docs.getdbt.com/blog/'
const DEV_ENV = 'dev-'
const PREVIEW_ENV = 'deploy-preview-'

// Set API endpoint and headers
let discourse_endpoint = `https://discourse.getdbt.com`
let headers = {
  'Accept': 'application/json',
  'Api-Key': DISCOURSE_DEVBLOG_API_KEY,
  'Api-Username': DISCOURSE_USER_SYSTEM,
}    

async function getDiscourseComments(req, res) {
  let topicId, comments, DISCOURSE_TOPIC_ID;
  console.log(req.query)

  const blogUrl = await getBlogUrl(req)
  
  if (blogUrl === DEVBLOG_PROD_URL) {
    DISCOURSE_TOPIC_ID = 21
  } else {
    DISCOURSE_TOPIC_ID = 2
  }

  try {
    const env =
      blogUrl === DEVBLOG_PROD_URL
        ? ""
        : blogUrl.includes("localhost")
        ? DEV_ENV
        : PREVIEW_ENV;
    const postTitle = `${env}${req.query.title}`;
    const postSlug = req.query.slug;
    const cleanSlug = cleanUrl(req.query.slug);
    const externalId = truncateString(`${env}${cleanSlug}`);

    console.table({
      blogUrl,
      postTitle,
      postSlug,
      cleanSlug,
      externalId,
    });


    if (!postSlug) throw new Error("Unable to query Discourse API. Error reading slug.");

    topicId = await searchDiscourseExternalId(externalId);

    // First check if the dev blog post exists in Discourse
    // Get the comments if it does
    if (typeof topicId === "number") {
      comments = await getDiscourseTopicbyID(topicId);
    } else {
      // If the dev blog post does not exist in Discourse
      // Create a new topic and get the comments
      topicId = await createDiscourseTopic(postTitle, externalId, cleanSlug, blogUrl, DISCOURSE_TOPIC_ID);
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

    //return await returnResponse(200, comments);
    return await res.status(200).json(comments);
  } catch (err) {
    console.log("err on getDiscourseComments", err);
    return await res.status(500).json({ error: "Unable to get topics from Discourse." });
  }
}

async function createDiscourseTopic(title, externalId, slug, blogUrl, DISCOURSE_TOPIC_ID) {
    console.log(`No topics found. Creating a new topic in Discourse - ${title}`)
    try  {
        const response = await axios.post(`${discourse_endpoint}/posts`, {
            title: title,
            raw: `This is a companion discussion topic for the original entry at ${blogUrl}${slug}`,
            category: DISCOURSE_TOPIC_ID,
            embed_url: `${blogUrl}${slug}`,
            external_id: externalId,
            tags: ['devblog'],
            visible: false
        }, { headers })

        let topicId = await response.data.topic_id

        console.log('Topic successfully created with topic_id', topicId)

        return topicId
    
    } catch(err) {
        console.log('err on createDiscourseTopic', err)
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
        console.log('err on getDiscourseTopicbyID', err)
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

// Truncate external_id to 50 characters per Discourse API requirements
function truncateString(str) {
  if (str.length <= 50) {
    return str
  }
  return str.slice(0, 50)
}

// Remove query params and hash from URL to prevent duplicate topics
function cleanUrl(url) {
  return url.split("?")[0].split("#")[0];
}

// Create a function to get the host name from the request and add /blog/ to the end
async function getBlogUrl(req) {
  const host = req.headers.host
  return `https://${host}/blog/`
}

// Test

module.exports = getDiscourseComments;
