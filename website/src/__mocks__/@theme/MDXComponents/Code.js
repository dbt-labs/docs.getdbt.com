// Jest stub for @theme/MDXComponents/Code. Distinct per module so identity checks work in tests.
const React = require('react');

export default function MockCode({ children }) {
  return React.createElement('div', null, children);
}
