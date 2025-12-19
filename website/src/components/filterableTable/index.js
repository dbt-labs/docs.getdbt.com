import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import getSvgIcon from '../../utils/get-svg-icon';
import styles from './styles.module.css';

const stripMarkdown = (text) => {
  if (!text) return '';
  let strippedText = String(text).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove markdown formatting but preserve underscores (for snake_case)
  strippedText = strippedText.replace(/[*`~]/g, '');
  return strippedText;
};

// Extract text content from DOM element
const extractTextFromElement = (element) => {
  if (!element) return '';
  return element.textContent || element.innerText || '';
};

// Extract text content from HTML (removes tags but preserves all text including underscores)
const extractTextFromHTML = (html) => {
  if (!html) return '';
  // Create a temporary div to parse HTML
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Get text content which preserves underscores, snake_case, etc.
    const text = div.textContent || div.innerText || '';
    return text.trim();
  }
  // Fallback: strip HTML tags and incomplete tags using regex
  // Handles both complete tags (<div>) and incomplete tags (<script)
  // lgtm[js/incomplete-sanitization]
  // CodeQL: Safe in this context - HTML from trusted markdown, used only for text extraction
  return html
    .replace(/<[^>]*>?/g, '')  // Remove complete and incomplete tags
    .replace(/&[a-z]+;/gi, '')  // Remove HTML entities
    .trim();
};

// Extract clean text from HTML and Markdown (for display in filter dropdowns)
const extractCleanText = (content) => {
  if (!content) return '';
  // First strip HTML tags, then strip markdown formatting
  const withoutHTML = extractTextFromHTML(content);
  const withoutMarkdown = stripMarkdown(withoutHTML);
  // Replace all whitespace (including non-breaking spaces) with regular spaces and trim
  return withoutMarkdown.replace(/\s+/g, ' ').trim();
};

// Get unique values from a column - preserves exact text including underscores
const getColumnValues = (data, colIndex) => {
  const values = new Set();
  data.forEach(row => {
    if (!row.isCategoryRow) {
      const cellContent = row.cells[colIndex] || '';
      // Extract text from HTML (preserves underscores, snake_case, etc.)
      const cellText = extractTextFromHTML(cellContent).trim();
      // Only strip markdown formatting, but keep the actual text content
      const cleanText = stripMarkdown(cellText).trim();
      // Normalize whitespace (replace multiple spaces, non-breaking spaces, etc. with single space)
      const normalizedText = cleanText.replace(/\s+/g, ' ').trim();
      if (normalizedText) {
        values.add(normalizedText);
      }
    }
  });
  return Array.from(values).sort();
};

// Parse table from DOM
const parseTableFromDOM = (tableElement) => {
  if (!tableElement) {
    return { headers: [], data: [], columnAlignments: [] };
  }

  const headers = [];
  const thead = tableElement.querySelector('thead');
  if (thead) {
    const headerRow = thead.querySelector('tr');
    if (headerRow) {
      headerRow.querySelectorAll('th').forEach(th => {
        // Preserve HTML content for headers (like <small>, <br>, etc.)
        headers.push(th.innerHTML || extractTextFromElement(th));
      });
    }
  }

  const data = [];
  const tbody = tableElement.querySelector('tbody');
  if (tbody) {
    tbody.querySelectorAll('tr').forEach((tr, rowIndex) => {
      const cells = [];
      tr.querySelectorAll('td, th').forEach(cell => {
        // Preserve HTML content for rendering
        cells.push(cell.innerHTML || extractTextFromElement(cell));
      });
      if (cells.length > 0) {
        const firstCellText = stripMarkdown(extractTextFromElement(tr.querySelector('td, th')));
        // Category rows are identified by ** markdown bold markers
        const isCategoryRow = firstCellText.includes('**');
        data.push({
          cells,
          isCategoryRow,
          originalIndex: rowIndex
        });
      }
    });
  }

  // Default alignments
  const columnAlignments = headers.map(() => 'left');
  
  return { headers, data, columnAlignments };
};

const FilterableTable = ({ children }) => {
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState({ headers: [], data: [], columnAlignments: [] });
  const [openFilterIndex, setOpenFilterIndex] = useState(null);
  const filterRefs = useRef({});

  // Parse table after component mounts and DOM is available
  useEffect(() => {
    if (tableRef.current) {
      const parsed = parseTableFromDOM(tableRef.current);
      setTableData(parsed);
    }
  }, [children]);

  const { headers, data: initialData, columnAlignments } = tableData;

  // Position dropdown when it opens (to the right of the arrow)
  useLayoutEffect(() => {
    if (openFilterIndex !== null && headers.length > 0) {
      const filterElement = filterRefs.current[openFilterIndex];
      const dropdown = filterElement?.querySelector(`.${styles.filterDropdown}`);
      if (dropdown && filterElement) {
        const th = filterElement.closest('th');
        const button = th?.querySelector(`.${styles.filterButton}`);
        if (button) {
          const rect = button.getBoundingClientRect();
          const thRect = th.getBoundingClientRect();
          // Position to the right of the button, aligned with top of header
          // getBoundingClientRect() gives viewport-relative positions (no scroll offset needed for fixed positioning)
          dropdown.style.top = `${thRect.top + 1}px`;
          dropdown.style.left = `${rect.right + 4}px`;
          
          // Ensure dropdown doesn't go off screen
          const dropdownWidth = dropdown.offsetWidth || 250;
          const viewportWidth = window.innerWidth;
          if (rect.right + dropdownWidth + 4 > viewportWidth) {
            // If it would overflow, position it to the left of the button instead
            dropdown.style.left = `${rect.left - dropdownWidth - 4}px`;
          }
        }
      }
    }
  }, [openFilterIndex, headers]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openFilterIndex !== null) {
        const filterElement = filterRefs.current[openFilterIndex];
        // Check if click is outside the dropdown AND not on a filter button
        const isFilterButton = event.target.closest(`.${styles.filterButton}`);
        if (filterElement && !filterElement.contains(event.target) && !isFilterButton) {
          setOpenFilterIndex(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openFilterIndex]);

  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [filterSearchQueries, setFilterSearchQueries] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Initialize column filters
  useEffect(() => {
    const initialFilters = {};
    headers.forEach((_, index) => {
      initialFilters[index] = [];
    });
    setColumnFilters(initialFilters);
  }, [headers]);

  // Get filter options for each column
  const columnFilterOptions = useMemo(() => {
    const options = {};
    headers.forEach((_, colIndex) => {
      const values = getColumnValues(initialData, colIndex);
      // Show filter if:
      // 1. Column has 1-20 unique values (good for dropdown)
      // 2. OR it's the first column (name/key column) with any number of values
      if ((values.length >= 1 && values.length <= 20) || (colIndex === 0 && values.length >= 1)) {
        options[colIndex] = values;
      }
    });
    return options;
  }, [headers, initialData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    if (initialData.length === 0) return [];
    
    let filtered = initialData.filter(row => {
      // Handle category rows
      if (row.isCategoryRow) {
        // If there's a search query, filter category rows by search
        if (searchQuery) {
          const categoryName = stripMarkdown(row.cells[0] || '').toLowerCase();
          return categoryName.includes(searchQuery.toLowerCase());
        }
        // If column filters are active, hide category rows to avoid confusion
        const hasActiveColumnFilters = Object.values(columnFilters).some(values => values.length > 0);
        if (hasActiveColumnFilters) {
          return false;
        }
        return true;
      }

      // Filter by search query (searches all cells)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = row.cells.some(cell => {
          const cellText = extractTextFromHTML(cell || '');
          const cleanText = stripMarkdown(cellText).toLowerCase();
          return cleanText.includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Filter by column filters
      for (let colIndex = 0; colIndex < headers.length; colIndex++) {
        const selectedValues = columnFilters[colIndex] || [];
        if (selectedValues.length > 0) {
          // Extract text from HTML the same way we do for filter options
          const cellText = extractTextFromHTML(row.cells[colIndex] || '').trim();
          const cleanCellText = stripMarkdown(cellText).trim();
          // Normalize whitespace to match how filter options are created
          const normalizedText = cleanCellText.replace(/\s+/g, ' ').trim();
          if (!selectedValues.includes(normalizedText)) {
            return false;
          }
        }
      }

      return true;
    });

    // Apply sorting
    if (sortConfig.key !== null) {
      filtered = [...filtered].sort((a, b) => {
        // Keep category rows at their original positions
        if (a.isCategoryRow && !b.isCategoryRow) return -1;
        if (!a.isCategoryRow && b.isCategoryRow) return 1;
        if (a.isCategoryRow && b.isCategoryRow) {
          return a.originalIndex - b.originalIndex;
        }

        const aCell = a.cells[sortConfig.key] || '';
        const bCell = b.cells[sortConfig.key] || '';
        const aText = extractTextFromHTML(aCell);
        const bText = extractTextFromHTML(bCell);
        const aVal = stripMarkdown(aText).trim();
        const bVal = stripMarkdown(bText).trim();

        // Try numeric comparison first
        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [initialData, searchQuery, columnFilters, headers, sortConfig]);

  const handleSort = (colIndex) => {
    setSortConfig(prev => {
      if (prev.key === colIndex) {
        // Cycle through: asc → desc → null (reset to original)
        if (prev.direction === 'asc') {
          return { key: colIndex, direction: 'desc' };
        } else {
          // Reset to original order
          return { key: null, direction: 'asc' };
        }
      }
      // New column, default to ascending
      return { key: colIndex, direction: 'asc' };
    });
  };

  const handleFilterToggle = (colIndex, event) => {
    if (event) {
      event.stopPropagation();
    }
    setOpenFilterIndex(openFilterIndex === colIndex ? null : colIndex);
  };

  const handleFilterChange = (colIndex, value, checked) => {
    setColumnFilters(prev => {
      const current = prev[colIndex] || [];
      if (checked) {
        return { ...prev, [colIndex]: [...current, value] };
      } else {
        return { ...prev, [colIndex]: current.filter(v => v !== value) };
      }
    });
  };

  const clearColumnFilter = (colIndex) => {
    setColumnFilters(prev => ({
      ...prev,
      [colIndex]: []
    }));
    setFilterSearchQueries(prev => ({
      ...prev,
      [colIndex]: ''
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    const clearedFilters = {};
    const clearedSearchQueries = {};
    headers.forEach((_, index) => {
      clearedFilters[index] = [];
      clearedSearchQueries[index] = '';
    });
    setColumnFilters(clearedFilters);
    setFilterSearchQueries(clearedSearchQueries);
  };

  const hasActiveFilters = searchQuery !== '' || 
    Object.values(columnFilters).some(values => values.length > 0);

  const hasActiveColumnFilter = (colIndex) => {
    return (columnFilters[colIndex] || []).length > 0;
  };

  return (
    <div className={styles.filterableTableContainer}>
      {/* Hidden table for data extraction */}
      <table ref={tableRef} style={{ display: 'none' }}>
        {children}
      </table>

      <div className={styles.tableWrapper}>
        {/* Search bar positioned at top right - always visible */}
        <div className={styles.searchBar}>
          <div className={styles.searchContainer}>
            {getSvgIcon("fa-magnifying-glass")}
            <input
              type="text"
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search table"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className={styles.clearAllButton}
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          )}
        </div>

        {hasActiveFilters && filteredData.length === 0 ? (
          <div className={styles.noResults}>
            DAG, no rows match your search criteria! Why don't you try changing your search or filters.
          </div>
        ) : (
          <table className={styles.filterableTable}>
            <thead>
              <tr>
                {headers.map((header, index) => {
                  const hasFilter = columnFilterOptions[index] !== undefined;
                  const isFilterOpen = openFilterIndex === index;
                  const hasActiveFilter = hasActiveColumnFilter(index);
                  
                  return (
                    <th 
                      key={index}
                      style={{ 
                        textAlign: columnAlignments[index] || 'left', 
                        padding: '10px',
                        position: 'relative'
                      }}
                    >
                      <div className={styles.headerContent}>
                        <div className={styles.headerText}>
                          <span 
                            className={styles.headerMarkdown}
                            onClick={() => handleSort(index)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Markdown>{header}</Markdown>
                          </span>
                          <div className={styles.headerControls}>
                            {hasFilter && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFilterToggle(index, e);
                                }}
                                className={`${styles.filterButton} ${hasActiveFilter ? styles.filterActive : ''}`}
                                aria-label={`Filter by ${extractCleanText(header)}`}
                                aria-expanded={isFilterOpen}
                              >
                                <span className={styles.filterIcon}>˅</span>
                              </button>
                            )}
                            <span className={styles.sortIndicator}>
                              {sortConfig.key === index && (
                                <>
                                  <span className={styles.sortArrow}>
                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSortConfig({ key: null, direction: 'asc' });
                                    }}
                                    className={styles.sortResetButton}
                                    aria-label="Reset sort"
                                    title="Reset sort to original order"
                                  >
                                    ×
                                  </button>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      {hasFilter && (
                        <div 
                          ref={el => filterRefs.current[index] = el}
                          className={styles.filterControl}
                        >
                          {isFilterOpen && (
                            <div className={styles.filterDropdown}>
                                <div className={styles.filterDropdownHeader}>
                                  <strong>Filter by {extractCleanText(header)}</strong>
                                  {hasActiveFilter && (
                                    <button
                                      onClick={() => clearColumnFilter(index)}
                                      className={styles.clearColumnFilter}
                                      aria-label="Clear filter"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                                {columnFilterOptions[index].length > 0 && (
                                  <div className={styles.filterCount}>
                                    Displaying {columnFilterOptions[index].length} {columnFilterOptions[index].length === 1 ? 'value' : 'values'}
                                  </div>
                                )}
                                {columnFilterOptions[index].length > 10 && (
                                  <div className={styles.filterSearchContainer}>
                                    <input
                                      type="text"
                                      placeholder="Search options..."
                                      value={filterSearchQueries[index] || ''}
                                      onChange={(e) => setFilterSearchQueries(prev => ({
                                        ...prev,
                                        [index]: e.target.value
                                      }))}
                                      className={styles.filterSearchInput}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                )}
                                <div className={styles.filterOptions}>
                                  {columnFilterOptions[index]
                                    .filter(value => {
                                      const searchQuery = filterSearchQueries[index] || '';
                                      if (!searchQuery) return true;
                                      return value.toLowerCase().includes(searchQuery.toLowerCase());
                                    })
                                    .map((value, valueIndex) => {
                                      const isChecked = (columnFilters[index] || []).includes(value);
                                      return (
                                        <label key={valueIndex} className={styles.filterOption}>
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => handleFilterChange(index, value, e.target.checked)}
                                          />
                                          <span className={styles.filterOptionText}>
                                            {value.length > 40 ? `${value.substring(0, 40)}...` : value}
                                          </span>
                                        </label>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 && !hasActiveFilters ? (
                <tr>
                  <td colSpan={headers.length || 5} style={{ textAlign: 'center', padding: '20px' }}>
                    Loading table...
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={row.isCategoryRow ? styles.categoryRow : ''}
                  >
                    {row.cells.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        style={{ 
                          textAlign: columnAlignments[cellIndex] || 'left', 
                          padding: '8px' 
                        }}
                        dangerouslySetInnerHTML={{ __html: cell || '\u00A0' }}
                      />
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FilterableTable;
