import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import axios from 'axios'

export const DiscourseBlogComments = (
    {
      title,
      slug
    }
  ) => {
  
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
  
    useEffect(() => {
      let isMounted = true
  
      const fetchData = async () => {
        try {

        const endpoint = window?.location?.hostname?.includes('localhost')
        ? `http://localhost:8888/.netlify/functions/get-discourse-comments?title=${title}&slug=${slug}`
        : `/.netlify/functions/get-discourse-comments?title=${title}&slug=${slug}`

          const { data } = await axios.get(endpoint)
  
          // Set error state if data not available
          if(!data) throw new Error('Unable to get latest topics.')
  
          // Set topics count
          if(isMounted) {
            setComments(data)
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
  
    console.log('comments', comments)
    return (
      <div>
        <h2>Comments</h2>
  
        {loading ? (
          <img
            src="/img/loader-icon.svg"
            alt="Loading"
            className={styles.loadingIcon}
            data-testid="feed-loader"
          />
        ) : isError || !comments?.length > 0 ? (
          <p data-testid='error-text'>No recent comments.</p>
        ) : (
          <ul data-testid="topics-list">
            {comments.map(comment => (
              <li key={comment.id} className={styles.discourseComments} > 
                {' '}
                <span>
                  by {comment.username}
                </span>
                <div dangerouslySetInnerHTML={{__html: comment.cooked}} />
        
              </li>
            ))}
          </ul>
        )}
  
      </div>
    )
  }
  
  