import React from 'react'
import { render, screen } from '@testing-library/react';
import { fail } from 'assert';
import DropdownNavbarItem from './index'

describe("Test DropdownNavbarItem component", () => {
  it('Should render new version when updateVersion method hit', () => {
    render(<DropdownNavbarItem>Test versioned content</DropdownNavbarItem>)
    fail('Failed')
  })
})
