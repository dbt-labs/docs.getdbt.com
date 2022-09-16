import React, { useState, useEffect } from 'react'
import axios from 'axios'
import feedStyles from './styles.module.css';

export default function DiscourseFeed({
  order = 'latest_topic',
  status = 'solved',
  after = undefined,
  before = undefined,
  inString = undefined, 
  min_posts = undefined,
  max_posts = undefined,
  min_views = undefined,
  max_views = undefined,
  tags = undefined, 
  term = undefined,
  category = 'help',
  title = undefined,
  link_text = "Ask the Community",
  link_href = `https://discourse.getdbt.com/new-topic${category ? `?category=${category}` : ''}${tags ? (!category ? `?tags=${tags}` : `&tags=${tags}`) : ''}`,
  hide_cta = false,
  topic_count = 5,
  styles = {}
}) {

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    // Get topics from Discourse API
    const fetchData = async () => {
      try {
        // Ensure error state is false and loading true
        setLoading(true)
        setIsError(false)

        // Build Netlify Function endpoint
        const endpoint = window?.location?.hostname?.includes('localhost')
          ? 'http://localhost:8888/.netlify/functions/get-discourse-topics'
          : '/.netlify/functions/get-discourse-topics'

        // If 'after' prop not passed in, set relative
        // after date for 'help' & 'discussions' categories
        let afterDate = after
        if(!afterDate) {
          // Today's date
          let today = new Date();
          if(category === 'help') {
            const relativeDate = new Date(today.setDate(today.getDate() - 30));
            afterDate = formatDate(relativeDate)
          } else if(category === 'discussions') {
            const relativeDate = new Date(today.setDate(today.getDate() - 90));
            afterDate = formatDate(relativeDate)
          }
        }
        
        // Get Discourse topics data
        const { data } = await axios.post(endpoint, {
          status,
          order,
          after: afterDate,
          before,
          inString, 
          min_posts,
          max_posts,
          min_views,
          max_views,
          tags, 
          term,
          category,
        })

        // Set error state if data not available
        if(!data) throw new Error('Unable to get latest topics.')

        // Set 5 latest toics
        setTopics(data.slice(0, topic_count))
        setLoading(false)
      } catch(err) {
        setIsError(true)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Set initial min-height
  // This is to avoid layout shifts
  // which affects Lighthouse performance scores
  const setMinHeight = isError
    ? 'auto'
    : 414

  return (
    <div className={feedStyles.discourseTopics} style={{minHeight: setMinHeight, ...styles}}>
      {title && (
        <h2>{title}</h2>
      )}
      {loading ? (
        <img src="/img/loader-icon.svg" alt="Loading" className={feedStyles.loadingIcon} />
      ) : isError || !topics?.length > 0 ? (
        <p>Unable to load forum topics at this time.</p>
      ) : (
        <ul>
          {topics.map(topic => (
            <li key={topic.id}>
              {topic?.has_accepted_answer && (
                <span className={feedStyles.solvedTopic} title="Solved">✅ </span>
              )}
              <TopicWrapper topic={topic}>{topic.title}</TopicWrapper>
              {/* <span> {topic.username && `- by ${topic.username}`}</span> */}
              {topic?.username || topic?.posts_count && (
                <>
                  {' '}-
                  <span>
                    {topic?.author && `by ${topic.author}${topic?.posts_count && ','}`}
                    {' '}
                    {topic?.posts_count && `${topic.posts_count} comments`}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {!hide_cta && (
        <a className={`button button--primary ${feedStyles.discourseCta}`} href={link_href} title={link_text} target="_blank">{link_text}</a>
      )}
    </div>
  )
}

function TopicWrapper({ topic, children }) {
  if(topic?.slug) {
    return (
      <a href={`https://discourse.getdbt.com/t/${topic.slug}`} title={topic.title} target="_blank">{children}</a>
    )
  } else {
    return (
      <div>{children}</div>
    )
  }
}

function formatDate(date) {
  return `${date.getFullYear()}-${('0'+ (date.getMonth()+1)).slice(-2)}-${('0'+ date.getDate()).slice(-2)}`
}
