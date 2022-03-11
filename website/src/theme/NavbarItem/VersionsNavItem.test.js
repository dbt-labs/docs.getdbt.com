import React from 'react'
import { render, screen } from '@testing-library/react';
import { fail } from 'assert';
import VersionsNavItem from './index'

describe("Test DropdownNavbarItem component", () => {
  it('Should render new version when updateVersion method hit', () => {
    render(<VersionsNavItem>Test versioned content</VersionsNavItem>)
    fail('Failed')
  })
})
