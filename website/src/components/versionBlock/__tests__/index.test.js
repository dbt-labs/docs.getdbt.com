import React from 'react'
import { render, screen } from '@testing-library/react';
import VersionBlock from '../index'

describe("Test VersionBlock component", () => {
  it('Should render same text passed into title prop', () => { 
    render(<VersionBlock>This is a test</VersionBlock>)
    const testElement = screen.getByText(/this is a test/i)
    expect(testElement).toBeInTheDocument()
  })
})
