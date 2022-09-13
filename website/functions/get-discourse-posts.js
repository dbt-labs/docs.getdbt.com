const axios = require('axios')

async function getDiscoursePosts() {
  const { DISCOURSE_API_KEY , DISCOURSE_USER } = process.env

  try {
    // Set API endpoint and headers
    let discourse_endpoint = `https://discourse.getdbt.com`
    let headers = {
      'Accept': 'application/json',
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': DISCOURSE_USER,
    }

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS' 
  }
  const resObj = {
    statusCode: status,
    headers,
    body: JSON.stringify(res)
  }
  return resObj
}

exports.handler = getDiscoursePosts
