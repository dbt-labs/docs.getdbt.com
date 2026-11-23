// Jest stub for @theme/MDXComponents/Img. Distinct per module so identity checks work in tests.
const React = require('react');

export default function MockImg({ children }) {
  return React.createElement('div', null, children);
}
