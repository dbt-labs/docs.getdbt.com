import { useState } from "react";
import Link from "@docusaurus/Link";
import { ThumbsUp } from "./ThumbsUp";
import { ThumbsDown } from "./ThumbsDown";
import styles from "./styles.module.css";
import { validateTextInput } from "../../utils/validate-text-input";

/**
 * Feedback component to handle visitor feedback for the current docs page.
 * @returns {void}
 */

export const Feedback = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [textFeedback, setTextFeedback] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleRatingSelect = (feedbackValue) => {
    if (hasSubmitted) {
      return;
    }
    setSelectedFeedback(feedbackValue);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextFeedback(newText);

    // Validate input on change
    if (newText.trim()) {
      validateTextInput(newText, setValidationError);
    } else {
      setValidationError("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent resubmission if already submitted
    if (hasSubmitted) {
      return;
    }

    // Require rating selection
    if (selectedFeedback === null) {
      return;
    }

    // Validate text input before submission
    if (
      textFeedback.trim() &&
      !validateTextInput(textFeedback, setValidationError)
    ) {
      return;
    }

    setSubmissionStatus("loading");

    try {
      // Execute reCAPTCHA
      const token = await window.grecaptcha.execute(
        "6LeIksMrAAAAABYsWNCpUv15lXXzEZj91zdDCymo",
        {
          action: "feedback_submission",
        }
      );

      // Submit feedback to db
      const response = await fetch(
        "https://www.getdbt.com/api/submit-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_positive: selectedFeedback,
            message: textFeedback.trim(),
            page_url: window.location.href,
            recaptcha_token: token,
          }),
        }
      );

      const data = await response.json();

      // If error, set submission status to error and throw error
      if (data?.error) {
        throw new Error(data?.error);
      }

      // If success, set submission status to success
      setSubmissionStatus("success");
      setHasSubmitted(true);
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      <h2 id="feedback-header" className={styles.feedbackHeader}>Was this page helpful?</h2>
      <form onSubmit={handleFormSubmit} className={styles.feedbackActions}>
        <div className={styles.feedbackButtons}>
          <button
            type="button"
            className={`${styles.feedbackButton} ${selectedFeedback === true ? styles.feedbackButtonSelected : ""}`}
            onClick={() => handleRatingSelect(true)}
            disabled={hasSubmitted}
          >
            <ThumbsUp />
            Yes
          </button>
          <button
            type="button"
            className={`${styles.feedbackButton} ${selectedFeedback === false ? styles.feedbackButtonSelected : ""}`}
            onClick={() => handleRatingSelect(false)}
            disabled={hasSubmitted}
          >
            <ThumbsDown />
            No
          </button>
        </div>
        {selectedFeedback !== null && (
          <>
            {!hasSubmitted && (
            <div className={styles.feedbackInput}>
              <textarea
                placeholder="Tell us what you think..."
                value={textFeedback}
                onChange={handleTextChange}
                disabled={hasSubmitted && submissionStatus === "success"}
                  maxLength={2000}
                />
              </div>
            )}
            {submissionStatus === "loading" ? (
              <span className={styles.feedbackMessage}>
                Submitting feedback...
              </span>
            ) : submissionStatus === "success" ? (
              <span className={styles.feedbackMessage}>
                Thank you for your feedback!
              </span>
            ) : (
              <button
                type="submit"
                className={styles.feedbackSubmitButton}
                disabled={!!validationError}
              >
                Submit Feedback
              </button>
            )}
            {validationError && (
              <span
                className={`${styles.feedbackMessage} ${styles.validationError}`}
              >
                {validationError}
              </span>
            )}
            {submissionStatus === "error" && (
              <span className={styles.feedbackMessage}>
                Error submitting feedback. Please try again.
              </span>
            )}
          </>
        )}
      </form>
      <div>
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
        <div className={styles.feedbackDisclaimer}>
          <p>
              This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};
