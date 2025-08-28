import { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import { ThumbsUp } from "./ThumbsUp";
import { ThumbsDown } from "./ThumbsDown";
import styles from "./styles.module.css";

/**
 * Feedback component to handle visitor feedback for the current docs page.
 * @returns {void}
 */

export const Feedback = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const FEEDBACK_STORAGE_KEY = 'page_feedback_data';

  // Get all feedback data from localStorage
  const getFeedbackData = () => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  };

  // Save feedback data to localStorage
  const saveFeedbackData = (feedbackArray) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackArray));
    } catch (error) {
      return;
    }
  };

  // Find existing feedback for current page
  const findPageFeedback = (feedbackArray, pageUrl) => {
    return feedbackArray.find(item => item.page_url === pageUrl);
  };

  // Load feedback state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const feedbackArray = getFeedbackData();
      const existingFeedback = findPageFeedback(feedbackArray, currentUrl);
      
      if (existingFeedback) {
        setSelectedFeedback(existingFeedback.is_positive);
        setHasSubmitted(true);
      }
    }
  }, []);

  const handleFeedbackSubmit = async (feedbackValue) => {
    // Prevent resubmission if already submitted
    if (hasSubmitted) {
      return;
    }

    setSubmissionStatus("loading");
    setSelectedFeedback(feedbackValue);

    try {
      const response = await fetch(
        "https://www.getdbt.com/api/submit-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_positive: feedbackValue,
            page_url: window.location.href,
          }),
        }
      );

      const data = await response.json();

      // If error, set submission status to error and throw error
      if (data?.error) {
        throw new Error(data?.error);
      }

      // Save to localStorage array
      const currentUrl = window.location.href;
      const feedbackArray = getFeedbackData();
      const existingFeedbackIndex = feedbackArray.findIndex(item => item.page_url === currentUrl);
      
      const newFeedbackItem = {
        is_positive: feedbackValue,
        timestamp: Date.now(),
        page_url: currentUrl
      };

      if (existingFeedbackIndex >= 0) {
        // Update existing feedback
        feedbackArray[existingFeedbackIndex] = newFeedbackItem;
      } else {
        // Add new feedback
        feedbackArray.push(newFeedbackItem);
      }

      saveFeedbackData(feedbackArray);

      // If success, set submission status to success
      setSubmissionStatus("success");
      setHasSubmitted(true);
    } catch (error) {
      setSubmissionStatus("error");
      setSelectedFeedback(null); // Reset selection on error
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.feedbackHeader}>Was this page helpful?</h2>
      <div className={styles.feedbackButtons}>
        <button 
          className={`${styles.feedbackButton} ${selectedFeedback === true ? styles.feedbackButtonSelected : ''}`}
          onClick={() => handleFeedbackSubmit(true)}
          disabled={hasSubmitted}
        >
          <ThumbsUp />
          Yes
        </button>
        <button 
          className={`${styles.feedbackButton} ${selectedFeedback === false ? styles.feedbackButtonSelected : ''}`}
          onClick={() => handleFeedbackSubmit(false)}
          disabled={hasSubmitted}
        >
          <ThumbsDown />
          No
        </button>
        {submissionStatus === "loading" ? (
          <span className={styles.feedbackMessage}>
            Submitting feedback...
          </span>
          ) : submissionStatus === "success" ? (
          <span className={styles.feedbackMessage}>Thank you for your feedback!</span>
        ) : submissionStatus === "error" ? (
          <span className={styles.feedbackMessage}>
            Error submitting feedback. Please try again.
          </span>
        ) : null}
      </div>
      <div className={styles.feedbackLinks}>
        <Link
          href="https://www.getdbt.com/cloud/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy policy
        </Link> 
        <Link
          href="https://github.com/dbt-labs/docs.getdbt.com/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create a GitHub issue
        </Link>
      </div>
    </div>
  );
};
