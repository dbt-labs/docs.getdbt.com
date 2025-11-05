import { useState, useEffect, useRef } from 'react';
import { useRawMarkdownContent } from './markdown-utils';
import { LLM_SERVICES } from '../components/copyPage/config';

/**
 * Custom hook to manage CopyPage functionality
 * Handles dropdown state, clipboard operations, LLM integration, and error states
 * @returns {Object} State and handlers for the CopyPage component
 */
export function useCopyPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const rawMarkdownContent = useRawMarkdownContent();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isDropdownOpen]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Copy text to clipboard
   * @param {string} content - Text to copy
   */
  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setError(null);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setError('Failed to copy to clipboard');
    }
  };

  /**
   * Handle copying the page markdown to clipboard
   */
  const handleCopyPage = async () => {
    if (!rawMarkdownContent) {
      setError('Content not available for this page');
      return;
    }

    try {
      await copyToClipboard(rawMarkdownContent);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error copying page content:', error);
      setError('Error copying page content');
    }
  };

  /**
   * Open current page in an LLM service
   * @param {string} serviceKey - Key of the LLM service from config
   */
  const handleOpenInLLM = (serviceKey) => {
    const service = LLM_SERVICES[serviceKey];

    if (!service) {
      console.error(`Unknown LLM service: ${serviceKey}`);
      setError(`Service ${serviceKey} not configured`);
      return;
    }

    try {
      // Always use the production domain to avoid localhost/preview URLs in LLM context
      const productionUrl = `https://docs.getdbt.com${window.location.pathname}${window.location.search}${window.location.hash}`;
      const encodedUrl = encodeURIComponent(productionUrl);
      const llmUrl = service.url.replace('{url}', encodedUrl);

      window.open(llmUrl, '_blank', 'noopener,noreferrer');
      setIsDropdownOpen(false);
      setError(null);
    } catch (error) {
      console.error(`Error opening in ${serviceKey}:`, error);
      setError(`Failed to open ${service.name}`);
    }
  };

  /**
   * Toggle dropdown open/closed
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    setError(null);
  };

  return {
    // State
    isDropdownOpen,
    copySuccess,
    error,
    rawMarkdownContent,
    llmServices: LLM_SERVICES,

    // Refs
    dropdownRef,

    // Handlers
    handleCopyPage,
    handleOpenInLLM,
    toggleDropdown,
  };
}
