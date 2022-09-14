const axios = require('axios')

async function getDiscoursePosts({ body }) {
  console.log('body', body)
  const { DISCOURSE_API_KEY , DISCOURSE_USER } = process.env

  try {
    // Set API endpoint and headers
    let discourse_endpoint = `https://discourse.getdbt.com`
    let headers = {
      'Accept': 'application/json',
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': DISCOURSE_USER,
    }

    buildQueryString(body)

    // Get topics from Discourse
    let { data: { topic_list } } = await axios.get(`${discourse_endpoint}/latest`, { headers })
    
    if(!topic_list)
      throw new Error('Unable to get results from api request.')

    // Return posts 
    return await returnResponse(200, topic_list)
  } catch(err) {
    // Log and return the error
    console.log('err', err)
    return await returnResponse(500, { error: 'Unable to get events from Discourse.'})
  }
}

async function returnResponse(status, res) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS' 
  }
  const resObj = {
    statusCode: status,
    headers,
    body: JSON.stringify(res)
  }
  return resObj
}

function buildQueryString(body) {
  // const {
  //   status,
  //   order,
  //   after,
  //   before,
  //   inString, 
  //   min_posts,
  //   max_posts,
  //   min_views,
  //   max_views,
  //   tags, 
  //   term,
  //   category,
  // } = body

  if(!body) return null

  // start with empty query string
  let query = ''

  // check param and apply to query if set
  for(const [key, value] of Object.entries(JSON.parse(body))) {
    console.log(`${key}: ${value}`);

    // validate categories
    // if valid, add to query string
    if(validateItem({ key, value })) {
      key === 'category'
        ?query += `${value} `
        : query += `${key}:${value} `
    }
  }

  console.log('full query', query)
}

function validateItem({ key, value }) {
  // predefined Discourse values
  // https://docs.discourse.org/#tag/Search/operation/search
  const inStringValues = ['title', 'likes', 'personal', 'messages', 'seen', 'unseen', 'posted', 'created, watching', 'tracking', 'bookmarks', 'assigned', 'unassigned', 'first', 'pinned', 'wiki']
  const orderValues = ['latest', 'likes', 'views', 'latest_topic']
  const statusValues = ['open', 'closed', 'public', 'archived', 'noreplies', 'single_user', 'solved', 'unsolved']

  // validate keys
  if(key === 'category') {
    return value.slice(0, 1) === '#'
      ? true
      : false
  } else if(key === 'inString') {
    return inStringValues.includes(value)
      ? true
      : false
  } else if(key === 'order') {
    return orderValues.includes(value)
      ? true
      : false
  } else if(key === 'status') {
    return statusValues.includes(value)
      ? true
      : false
  } else {
    return true
  }
}

exports.handler = getDiscoursePosts
