// Jest stub for @theme/MDXComponents/Ul. Distinct per module so identity checks work in tests.
const React = require('react');

export default function MockUl({ children }) {
  return React.createElement('div', null, children);
}
