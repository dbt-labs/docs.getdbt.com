// Jest stub for @theme/MDXComponents/A. Distinct per module so identity checks work in tests.
const React = require('react');

export default function MockA({ children }) {
  return React.createElement('div', null, children);
}
