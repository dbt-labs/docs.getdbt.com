import React, { useState, useEffect } from 'react'
import axios from 'axios'
import feedStyles from './styles.module.css';

export default function DiscourseFeed({
  order = 'latest_topic',
  status = undefined,
  after = undefined,
  before = undefined,
  inString = undefined, 
  min_posts = undefined,
  max_posts = undefined,
  min_views = undefined,
  max_views = undefined,
  tags = undefined, 
  term = undefined,
  category = undefined,
  title = undefined,
  link_text = "See latest topics",
  link_href = "https://discourse.getdbt.com/",
  post_count = 5
}) {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure error state is false and loading true
        setLoading(true)
        setIsError(false)

        // Build Netlify Function endpoint
        const endpoint = window?.location?.hostname?.includes('localhost')
          ? 'http://localhost:8888/.netlify/functions/get-discourse-posts'
          : '/.netlify/functions/get-discourse-posts'

        // Get Discourse topics data
        const { data } = await axios.post(endpoint, {
          status,
          order,
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

    // return () => {
    //   setPosts([])
    // }
  }, [])

  return (
    <section className={feedStyles.discourseSection}>
      <h1>dbt Discourse</h1>
      <div className={feedStyles.discoursePosts}>
        {title && (
          <h2>{title}</h2>
        )}
        {loading ? (
          <img src="img/loader-icon.svg" alt="Loading" className={feedStyles.loadingIcon} />
        ) : isError || !posts?.length > 0 ? (
          <p>Unable to load Discourse posts at this time.</p>
        ) : (
          <ul>
            {posts.map(post => (
              <li>
                <PostWrapper post={post}>{post.title}</PostWrapper>
                <span> {post.username && `- by ${post.username}`}</span>
              </li>
            ))}
          </ul>
        )}
        
       
        <a className={`button button--primary ${feedStyles.discourseCta}`} href={link_href} title={link_text} target="_blank">{link_text}</a>
      </div>
    </section>
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
