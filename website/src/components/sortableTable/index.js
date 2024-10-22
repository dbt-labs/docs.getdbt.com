import React, { useState } from 'react';

const parseMarkdownTable = (markdown) => {
  const rows = markdown.trim().split('\n');
  const headers = rows[0].split('|').map((header) => header.trim()).filter(Boolean);
  const data = rows.slice(1).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
  return { headers, data };
};

const SortableTable = ({ children, columnAlignments }) => {
  const { headers, data: initialData } = parseMarkdownTable(children);

  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const sortTable = (keyIndex) => {
    const newDirection = (sortConfig.key === keyIndex && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key: keyIndex, direction: newDirection });

    const sortedData = [...data].sort((a, b) => {
      const aVal = a[keyIndex];
      const bVal = b[keyIndex];
      if (aVal < bVal) return newDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th 
              key={index} 
              onClick={() => sortTable(index)} 
              style={{ cursor: 'pointer', position: 'relative', textAlign: columnAlignments[index] || 'left', padding: '10px' }} // Apply alignment
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: columnAlignments[index] === 'center' ? 'center' : columnAlignments[index] }}>
                <span style={{ marginRight: '5px' }}>{header}</span>
                {/* Always show both carets */}
                <span style={{ 
                  opacity: sortConfig.key === index && sortConfig.direction === 'asc' ? 1 : (sortConfig.key === index ? 0.5 : 0.5) 
                }}>
                  ↑
                </span>
                <span style={{
                  marginLeft: '5px', 
                  opacity: sortConfig.key === index && sortConfig.direction === 'desc' ? 1 : (sortConfig.key === index ? 0.5 : 0.5) 
                }}>
                  ↓
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={{ textAlign: columnAlignments[cellIndex] || 'left', padding: '8px' }}>{cell || '\u00A0'}</td> // Apply alignment to cells
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
