import React, { useState, useEffect } from 'react';
import { unified } from 'unified';
import parse from 'remark-parse';
import remark2html from 'remark-html';
import parseHtml from 'html-react-parser';
import gfm from 'remark-gfm';

function expandTable({ markdown }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log("Received Markdown:", markdown);
    if (markdown) {
      unified()
        .use(parse)
        .use(gfm)
        .use(remark2html)
        .process(markdown)
        .then(file => {
          const htmlString = String(file);
          const reactElements = parseHtml(htmlString);
          const table = reactElements.find(element => element.type === 'table');
          if (table) {
            const rows = table.props.children.props.children;
            const headers = rows[0].props.children.map(th => th.props.children);
            const data = rows.slice(1).map(tr => {
              const rowData = {};
              tr.props.children.forEach((td, index) => {
                rowData[headers[index]] = td.props.children;
              });
              return rowData;
            });
            setTableData(data);
          }
        })
        .catch(error => console.error(`Error processing markdown:`, error));
    }
  }, [markdown]);

  const handleExpandToggle = () => setIsExpanded(!isExpanded);
  console.log(isExpanded)
  const handleFilterChange = (e) => setFilter(e.target.value.toLowerCase());

  const filteredData = tableData.filter(row =>
    Object.values(row).some(cell => 
      typeof cell === 'string' && cell.toLowerCase().includes(filter)
    )
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <button onClick={handleExpandToggle}>
          {isExpanded ? 'Collapse Table' : 'Expand Table'}
        </button>
        <input 
          type="text" 
          value={filter} 
          onChange={handleFilterChange} 
          placeholder="Filter..."
          style={{ visibility: isExpanded ? 'visible' : 'hidden' }}
        />
      </div>
      {isExpanded && tableData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(tableData[0]).map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default expandTable;
