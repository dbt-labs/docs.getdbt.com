/* eslint-env jest */
module.exports = {
  useLocation: jest.fn(() => ({
    pathname: '/',
    search: '',
    hash: '',
  })),
};
