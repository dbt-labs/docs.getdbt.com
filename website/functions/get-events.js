const axios = require('axios')

async function getEvents() {
  const { ADDEVENT_API_TOKEN, ADDEVENT_CALENDAR_ID } = process.env

  try {
    // Set API endpoint and headers
    let addevent_endpoint = `https://www.addevent.com/api/v1/oe/events/list/?token=${ADDEVENT_API_TOKEN}&calendar_id=${ADDEVENT_CALENDAR_ID}`
    let headers = {
      'Content-Type': 'application/json'
    }

    // Get events from AddEvent
    let { data } = await axios.get(addevent_endpoint, { headers })
    if(!data)
      throw new Error('Unable to get results from api request.')

    // Return events 
    return await returnResponse(200, data)
  } catch(err) {
    // Log and return the error
    console.log('err', err)
    return await returnResponse(500, { error: 'Unable to get events from AddEvent.'})
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

exports.handler = getEvents
