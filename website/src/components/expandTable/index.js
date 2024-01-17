/* import React, { useState } from 'react';
import { parseMarkdownTable } from 'some-markdown-parser'; // Replace with your choice of parser

function ExpandableFilterableTable({ markdown }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');
  const tableData = parseMarkdownTable(markdown);

  const handleExpandToggle = () => setIsExpanded(!isExpanded);
  const handleFilterChange = (e) => setFilter(e.target.value);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = tableData.filter(row => 
    row.some(cell => cell.includes(filter))
  );

  return (
    <div className="table-container">
      <button onClick={handleExpandToggle}>
        {isExpanded ? 'Collapse Table' : 'Expand Table'}
      </button>
      <input type="text" value={filter} onChange={handleFilterChange} placeholder="Filter..." />
      <table>

      </table>
    </div>
  );
}

export default ExpandableFilterableTable;
*/ 
