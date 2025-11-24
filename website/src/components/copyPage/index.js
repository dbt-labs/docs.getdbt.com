import React from 'react';
import styles from './styles.module.css';
import { useCopyPage } from '../../utils/use-copy-page';
import getSvgIcon from '../../utils/get-svg-icon';
import Link from '@docusaurus/Link';

/**
 * CopyPage Component
 * Provides a dropdown menu for copying page content or opening it in LLM services
 * Features:
 * - Copy markdown content to clipboard
 * - Open page in configured LLM services (ChatGPT, Claude, etc.)
 * - Full keyboard navigation and accessibility support
 * - Error handling and user feedback
 *
 * @param {Object} props
 * @param {boolean} [props.dropdownRight=false] - Align dropdown to the right (used on guides pages)
 * @param {string} [props.pageUrl] - Fully qualified canonical URL for the current page,
 *   used to build LLM links. If omitted, the hook will fall back to window.location.
 */
function CopyPage({ dropdownRight = false, pageUrl }) {
  const {
    isDropdownOpen,
    copySuccess,
    error,
    llmServices,
    dropdownRef,
    handleCopyPage,
    toggleDropdown,
  } = useCopyPage({ pageUrl });

  return (
    <div className={styles.copyPageContainer} ref={dropdownRef}>
      <button
        className={`${styles.copyButton} ${copySuccess ? styles.success : ''}`}
        onClick={toggleDropdown}
        aria-label="Copy page options"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {getSvgIcon("copy", { className: styles.copyIcon })}
        Copy page
        {getSvgIcon("chevron-down", { className: styles.dropdownIcon })}
      </button>

      <div
        className={`${styles.dropdown} ${dropdownRight ? styles.dropdownRight : ''} ${!isDropdownOpen ? styles.dropdownHidden : ''}`}
        role="menu"
        aria-label="Copy page menu"
        aria-hidden={!isDropdownOpen}
      >
        <button
          className={styles.dropdownItem}
          onClick={handleCopyPage}
          role="menuitem"
          tabIndex={isDropdownOpen ? "0" : "-1"}
        >
          {getSvgIcon("copy", {})}
          <div className={styles.dropdownItemContent}>
            <div className={styles.dropdownItemTitle}>Copy page</div>
            <div className={styles.dropdownItemSubtitle}>
              Copy page as Markdown for LLMs
            </div>
          </div>
        </button>

        {Object.entries(llmServices).map(([serviceKey, service]) => (
          <Link
            key={serviceKey}
            id={service.id}
            className={styles.dropdownItem}
            href={service.computedUrl}
            target="_blank"
            role="menuitem"
            tabIndex={isDropdownOpen ? "0" : "-1"}
          >
            {getSvgIcon("external-link", {})}
            <div className={styles.dropdownItemContent}>
              <div className={styles.dropdownItemTitle}>
                Open in {service.name}
              </div>
              <div className={styles.dropdownItemSubtitle}>
                {service.subtitle}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {copySuccess && (
        <div
          className={styles.successMessage}
          role="status"
          aria-live="polite"
        >
          Copied to clipboard!
        </div>
      )}

      {error && (
        <div
          className={styles.errorMessage}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default CopyPage;
