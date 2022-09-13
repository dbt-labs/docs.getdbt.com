import React, { useState, useEffect } from 'react'
import axios from 'axios'
import feedStyles from './styles.module.css';

export default function DiscourseFeed(styles = {}) {
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
        const { data: { topics } } = await axios.get(endpoint)

        // Set error state if data not available
        if(!topics) throw new Error('Unable to get latest topics.')

        // Set 5 latest posts
        setPosts(topics.slice(0, 5))
        setLoading(false)
      } catch(err) {
        setIsError(true)
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <section className={feedStyles.discourseSection}>
      <h1>dbt Discourse</h1>
      <div className={feedStyles.discoursePosts}>
        <h2>Latest posts</h2>
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
        
       
        <a className={`button button--primary ${feedStyles.discourseCta}`} href="https://discourse.getdbt.com/" title="See all latest posts" target="_blank">See all latest posts</a>
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
