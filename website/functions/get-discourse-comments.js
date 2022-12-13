const axios = require('axios')

async function getDiscourseTopics( event ) {
  const { DISCOURSE_DEVBLOG_API_KEY , DISCOURSE_USER_SYSTEM } = process.env

      // Set API endpoint and headers
      let discourse_endpoint = `https://discourse.getdbt.com`
      let headers = {
        'Accept': '*/*',
        'Api-Key': DISCOURSE_DEVBLOG_API_KEY,
        'Api-Username': DISCOURSE_USER_SYSTEM,
      }
  
      let postTitle = event.queryStringParameters.title
      let postSlug = event.queryStringParameters.slug
      let postTitleEncoded = encodeURIComponent(postTitle)

  try {


    const query = 'How%20to%20Build%20a%20Mature%20dbt%20Project%20from%20Scratch'
    if(!query) throw new Error('Unable to build query string.')
    

    // Check if we have a topic from Discourse that matches the dev blog post title
    let data = await axios.get(`${discourse_endpoint}/search?q=${postTitleEncoded}&in:title`, { headers })


    

    if(!data || data?.length <= 0) {
        console.log(data.topics)
        // Create a new topic when no posts are found
        console.log('No topics found. Creating a new topic', postTitleEncoded)
        

        //   axios.post(`${discourse_endpoint}/posts`, {
        //       title: postTitle,
        //       raw: `This is a companion discussion topic for the original entry at http://localhost:8888/blog/${postSlug}`,
        //       category: 2
        //   }, { headers })


    } else {

        // Else return the posts for that specific topic
        console.log('Topics found', data)

        //
        
    }


    //console.log('data', posts)

    //console.log('context', postTitle)


    // Return topics 
    return await returnResponse(200, data.topics)
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
