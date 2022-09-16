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
  post_count = 5,
  styles = {}
}) {

  const [posts, setPosts] = useState([])
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
          ? 'http://localhost:8888/.netlify/functions/get-discourse-posts'
          : '/.netlify/functions/get-discourse-posts'

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

        // Set 5 latest posts
        setPosts(data.slice(0, post_count))
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
    <div className={feedStyles.discoursePosts} style={{minHeight: setMinHeight, ...styles}}>
      {title && (
        <h2>{title}</h2>
      )}
      {loading ? (
        <img src="/img/loader-icon.svg" alt="Loading" className={feedStyles.loadingIcon} />
      ) : isError || !posts?.length > 0 ? (
        <p>Unable to load forum posts at this time.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              {post?.has_accepted_answer && (
                <span className={feedStyles.solvedPost} title="Solved">✅ </span>
              )}
              <PostWrapper post={post}>{post.title}</PostWrapper>
              {/* <span> {post.username && `- by ${post.username}`}</span> */}
              {post?.username || post?.posts_count && (
                <>
                  {' '}-
                  <span>
                    {post?.username && `by ${post.username}${post?.posts_count && ','}`}
                    {' '}
                    {post?.posts_count && `${post.posts_count} comments`}
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

function PostWrapper({ post, children }) {
  if(post?.slug) {
    return (
      <a href={`https://discourse.getdbt.com/t/${post.slug}`} title={post.title} target="_blank">{children}</a>
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
