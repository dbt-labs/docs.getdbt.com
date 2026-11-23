// Jest stub for @theme/Tabs. Distinct per module so identity checks work in tests.
const React = require('react');

export default function MockTabs({ children }) {
  return React.createElement('div', null, children);
}
