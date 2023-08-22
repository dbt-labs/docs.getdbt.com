import React, { useState, useEffect } from 'react'
import axios from 'axios'
import feedStyles from './styles.module.css';

// Bare component with no default props set
export const DiscourseFeed = ({
  order,
  status,
  after,
  before,
  inString, 
  min_posts,
  max_posts,
  min_views,
  max_views,
  tags, 
  term,
  category,
  title,
  link_text,
  link_href,
  show_cta,
  topic_count = 5,
  styles = {}
}) => {

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let isMounted = true

    // Get topics from Discourse API
    const fetchData = async () => {
      try {
        // Ensure error state is false and loading true
        setLoading(true)
        setIsError(false)

        // Build function endpoint
        const endpoint = process?.env?.VERCEL === '1'
          ? `/api/get-discourse-topics`
          : `/.netlify/functions/get-discourse-topics`

        // If 'after' prop not passed in, set relative after date
        let afterDate = after
        if(!afterDate) {
          // Today's date
          let today = new Date();
          if(category === 'help') {
            const relativeDate = new Date(today.setDate(today.getDate() - 30));
            afterDate = formatDate(relativeDate)
          } else {
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

        // Set topics count
        if(isMounted) {
          setTopics(data.slice(0, topic_count))
          setLoading(false)
        }
      } catch(err) {
        setIsError(true)
        setLoading(false)
      }
    }
    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  // Set initial min-height
  // This is to avoid layout shifts
  // which affects Lighthouse performance scores
  const setMinHeight = isError || !topics?.length > 0
    ? 'auto'
    : 414
  
  return (
    <div className={feedStyles.discourseTopics} style={{minHeight: setMinHeight, ...styles}}>
      {title && (
        <h2>{title}</h2>
      )}
      {loading ? (
        <img 
          src="/img/loader-icon.svg" 
          alt="Loading" 
          className={feedStyles.loadingIcon} 
          data-testid="feed-loader"
        />
        ) : isError || !topics?.length > 0 ? (
          <p data-testid='error-text'>No recent forum posts for this topic. Ask a question!</p>
        ) : (
        <ul data-testid="topics-list">
          {topics.map(topic => (
            <li key={topic.id}>
              {topic?.has_accepted_answer && (
                <span className={feedStyles.solvedTopic} title="Solved">✅ </span>
              )}
              <TopicWrapper topic={topic}>{topic.title}</TopicWrapper>
              {(topic?.author || topic?.posts_count || topic?.like_count) && (
                <>
                  {' '}
                  <span>
                    {topic?.author && `by ${topic.author}${topic?.posts_count ? ',' : ''}`}
                    {' '}
                    {topic?.posts_count && `${topic.posts_count - 1} ${(topic.posts_count - 1) === 1 ? 'reply' : 'replies'}${topic?.like_count ? ',' : ''}`}
                    {' '}
                    {topic?.like_count ? `${topic.like_count} ${(topic.like_count) === 1 ? 'like' : 'likes'}` : ''}
                  </span>
                </>
              )}
              {(topic?.blurb) && (
                <>
                  {' '}
                  <blockquote>
                    {topic.blurb}
                  </blockquote>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {show_cta && (
        <a className={`button button--primary ${feedStyles.discourseCta}`} href={link_href} title={link_text} target="_blank" rel="noopener noreferrer" data-testid='feed-cta'>{link_text}</a>
      )}
    </div>
  )
}

// A more specific version of DiscourseFeed
// with default props set. Same props can be used
export const DiscourseHelpFeed = ({
  order = 'latest_topic',
  status = 'solved',
  category = 'help',
  tags, 
  show_cta = true,
  link_text = 'Ask the Community',
  link_href = `https://discourse.getdbt.com/new-topic${category ? `?category=${category}` : ''}${tags ? (!category ? `?tags=${tags}` : `&tags=${tags}`) : ''}`,
  after = '2000-01-01',
  before,
  inString, 
  min_posts,
  max_posts,
  min_views,
  max_views,
  term,
  title,
  topic_count = 3,
  styles = {}
}) => {
  return <DiscourseFeed 
    order={order}
    status={status}
    category={category}
    tags={tags}
    link_text={link_text}
    link_href={link_href}
    show_cta={show_cta}
    after={after}
    before={before}
    inString={inString}
    min_posts={min_posts}
    max_posts={max_posts}
    min_views={min_views}
    max_views={max_views}
    term={term}
    title={title}
    topic_count={topic_count}
    styles={styles}
  />
}

// Helpers
function TopicWrapper({ topic, children }) {
  if(topic?.slug && topic?.id) {
    return (
      <a href={`https://discourse.getdbt.com/t/${topic.slug}/${topic.id}`} title={topic.title} target="_blank" rel="noopener noreferrer">{children}</a>
    )
  } else {
    return (
      <div>{children}</div>
    )
  }
}

// Format date by YYYY-MM-DD
function formatDate(date) {
  return `${date.getFullYear()}-${('0'+ (date.getMonth()+1)).slice(-2)}-${('0'+ date.getDate()).slice(-2)}`
}

