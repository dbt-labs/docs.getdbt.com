import React from 'react';
import styles from './styles.module.css';
import { useCopyPage } from '../../utils/use-copy-page';
import getSvgIcon from '../../utils/get-svg-icon';

/**
 * CopyPage Component
 * Provides a dropdown menu for copying page content or opening it in LLM services
 * Features:
 * - Copy markdown content to clipboard
 * - Open page in configured LLM services (ChatGPT, Claude, etc.)
 * - Full keyboard navigation and accessibility support
 * - Error handling and user feedback
 */
function CopyPage({ dropdownRight = false }) {
  const {
    isDropdownOpen,
    copySuccess,
    error,
    llmServices,
    dropdownRef,
    handleCopyPage,
    handleOpenInLLM,
    toggleDropdown,
  } = useCopyPage();

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

      {isDropdownOpen && (
        <div
          className={`${styles.dropdown} ${dropdownRight ? styles.dropdownRight : ''}`}
          role="menu"
          aria-label="Copy page menu"
        >
          <button
            className={styles.dropdownItem}
            onClick={handleCopyPage}
            role="menuitem"
            tabIndex="0"
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
            <button
              key={serviceKey}
              className={styles.dropdownItem}
              onClick={() => handleOpenInLLM(serviceKey)}
              role="menuitem"
              tabIndex="0"
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
            </button>
          ))}
        </div>
      )}

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
