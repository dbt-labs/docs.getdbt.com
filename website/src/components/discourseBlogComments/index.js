import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import axios from 'axios'

export const DiscourseBlogComments = ({title,slug}) => {

    const DISCOURSE_TOPIC_ENDPOINT = `https://discourse.getdbt.com/t/`

    const [comments, setComments] = useState([])
    const [topicId, setTopicId] = useState(null)
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
          if(isMounted && data) {
            setComments(data.comments)
            setTopicId(data.topicId)
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
      
    }, [topicId])

    console.log(topicId)
    console.log('comments', comments)

    const resultData = () => {
      if (loading) {
        return <img
        src="/img/loader-icon.svg"
        alt="Loading"
        className={styles.loadingIcon}
        data-testid="feed-loader"
      />
      } else if (isError) {
        return <p data-testid='error-text'>Error loading comments. Please try again later.</p>
      } else if (!comments?.length && !isError) {
        return (
          <div>
            <p data-testid='no-comments-text'>No recent comments.</p>
            <a href={`${DISCOURSE_TOPIC_ENDPOINT}${topicId}`} target="_blank" rel="noopener noreferrer" title='Start a discussion' className={`button button--primary ${styles.discourseCta}`}>Start a discussion</a>
          </div>
        )
      } else {
        return (
          <div>
            <ul data-testid="topics-list">
              {comments.map(comment => (
                <li key={comment.id} className={styles.discourseComments} >
                  {' '}
                  <div>
                    <span className={styles.username}>{comment.username}</span> <span className={styles.userTitle}>{comment.user_title}</span>
                  </div>
                  <div dangerouslySetInnerHTML={{__html: comment.cooked}} />
                </li>
              ))}
               <a href={`https://discourse.getdbt.com/t/${topicId}`} target="_blank" rel="noopener noreferrer" title='Continnue discussion' className={`button button--primary ${styles.discourseCta}`}>Continue discussion</a>
            </ul>
           
          </div>
        )
      }
    }

    return (
      <div className={styles.commentContainer}>
        <h4 className='mt-4'>Comments</h4>
        {resultData()}
      </div>
    )
  }
