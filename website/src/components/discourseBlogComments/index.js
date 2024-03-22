import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import axios from 'axios'
import sanitizeHtml from 'sanitize-html';

export const DiscourseBlogComments = ({title,slug}) => {

    const DISCOURSE_TOPIC_ENDPOINT = `https://discourse.getdbt.com/t/`
    const commentsToLoad = 6

    const [postSlug, setPostSlug] = useState(slug)
    const [comments, setComments] = useState([])
    const [topicId, setTopicId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [next, setNext] = useState(commentsToLoad)

    // Handle loading more comments
    const loadMoreComments = () => {
      setNext(next + commentsToLoad)
    }
  
    useEffect(() => {
      let isMounted = true
      
      setPostSlug(slug)
  
      const fetchData = async () => {
        try {

          const endpoint = `/api/get-discourse-comments?title=${title}&slug=${slug}`
        
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
      
    }, [postSlug])

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
            <a data-testid='no-comments-text' href={sanitizeHtml(`${DISCOURSE_TOPIC_ENDPOINT}${topicId}`)} target="_blank" rel="noopener noreferrer" title='Start a discussion' className={`button button--primary ${styles.discourseCta}`}>Start a discussion</a>
          </div>
        )
      } else {
        return (
          <div>
            <ul className={styles.commentList} data-testid="comments-list">
              {comments?.slice(0, next)?.map((comment) => (
                <li key={comment.id} className={styles.discourseComments}>
                  {" "}
                  <div>
                    <span className={styles.username}>{comment.username}</span>{" "}
                    <span className={styles.userTitle}>
                      {comment.user_title}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(comment.cooked, {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                          "img",
                        ]),
                      }),
                    }}
                  />
                </li>
              ))}
              {next < comments?.length && (
                <button
                  className={`button button--link ${styles.loadMoreCta}`}
                  onClick={loadMoreComments}
                >
                  View more comments
                </button>
              )}
              <a
                href={sanitizeHtml(`${DISCOURSE_TOPIC_ENDPOINT}${topicId}`)}
                target="_blank"
                rel="noopener noreferrer"
                title="Continue discussion"
                className={`button button--primary ${styles.discourseCta}`}
              >
                Continue discussion
              </a>
            </ul>
          </div>
        );
      }
    }

    return (
      <div className={styles.commentContainer}>
        <h4 className='mt-4'>Comments</h4> 
        {resultData()}
      </div>
    )
  }
