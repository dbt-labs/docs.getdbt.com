// Jest stub for @theme/Admonition. Distinct per module so identity checks work in tests.
const React = require('react');

export default function MockAdmonition({ children }) {
  return React.createElement('div', null, children);
}
