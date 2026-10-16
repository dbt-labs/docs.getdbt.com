import React, { createContext } from 'react';
import styles from './styles.module.css';

// Context to signal that tables should render without filters
export const SimpleTableContext = createContext(false);

/**
 * SimpleTable - A wrapper component for rendering plain HTML tables without filters
 * Use this when you want a basic table without the FilterableTable search/filter functionality
 * 
 * Usage in MDX:
 * <SimpleTable>
 * 
 * | Column 1 | Column 2 |
 * |----------|----------|
 * | Data     | Data     |
 * 
 * </SimpleTable>
 */
const SimpleTable = ({ children }) => {
  return (
    <SimpleTableContext.Provider value={true}>
      <div className={styles.simpleTableWrapper}>
        {children}
      </div>
    </SimpleTableContext.Provider>
  );
};

export default SimpleTable;
