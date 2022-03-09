import React from 'react'
import { render, screen } from '@testing-library/react';
import { fail } from 'assert';
import VersionBlock from './index'

describe("Test VersionBlock component", () => {
  it('Should render same text passed into title prop', () => { 
    render(<VersionBlock>This is a test</VersionBlock>)
    const testElement = screen.getByText(/this is a test/i)
    expect(testElement).toBeInTheDocument()
    screen.debug()
  })

  it('Should render content when version from context is undefined', () => {
    render(<VersionBlock>Test versioned content</VersionBlock>)
    const content = screen.getByText(/Test versioned content/i)
    expect(content).toBeInTheDocument()
  })

  it('Should render content when both firstVersion or lastVersion props are undefined', () => {
    render(<VersionBlock>Test versioned content</VersionBlock>)
    fail('Failed')
  })
})
