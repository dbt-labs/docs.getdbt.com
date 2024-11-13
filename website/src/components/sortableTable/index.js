import React, { useState, useMemo } from 'react';
import Markdown from 'markdown-to-jsx';

const stripMarkdown = (text) => {
  let strippedText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  strippedText = strippedText.replace(/[_*`~]/g, '');
  return strippedText;
};

const parseMarkdownTable = (markdown) => {
  const rows = markdown.trim().split('\n');
  const headers = rows[0].split('|').map((header) => header.trim()).filter(Boolean);

  const alignmentsRow = rows[1].split('|').map((align) => align.trim()).filter(Boolean);
  const columnAlignments = alignmentsRow.map((alignment) => {
    if (alignment.startsWith(':') && alignment.endsWith(':')) {
      return 'center';
    } else if (alignment.startsWith(':')) {
      return 'left';
    } else if (alignment.endsWith(':')) {
      return 'right';
    } else {
      return 'left';
    }
  });

  const data = rows.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));

  return { headers, data, columnAlignments };
};

const SortableTable = ({ children }) => {
  const { headers, data: initialData, columnAlignments } = useMemo(
    () => parseMarkdownTable(children),
    [children]
  );

  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const sortTable = (keyIndex) => {
    const newDirection = (sortConfig.key === keyIndex && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key: keyIndex, direction: newDirection });

    const sortedData = [...data].sort((a, b) => {
      const aVal = stripMarkdown(a[keyIndex]);
      const bVal = stripMarkdown(b[keyIndex]);
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
              style={{ 
                cursor: 'pointer', 
                position: 'relative', 
                textAlign: columnAlignments[index], 
                padding: '10px' 
              }} 
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: columnAlignments[index] === 'center' ? 'center' : columnAlignments[index] 
              }}>
                <span style={{ marginRight: '5px' }}>{header}</span>
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
              <td 
                key={cellIndex} 
                style={{ 
                  textAlign: columnAlignments[cellIndex], 
                  padding: '8px' 
                }}
              >
                <Markdown>{cell || '\u00A0'}</Markdown>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
