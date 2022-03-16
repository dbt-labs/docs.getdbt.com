import React from 'react'
import { render, screen } from '@testing-library/react';
import { fail } from 'assert';
import VersionBlock from './index'
import { VersionContextProvider } from '../../stores/VersionContext'

describe("Test VersionBlock component", () => {
  it('Should render same text passed into title prop', () => { 
    render(<VersionBlock>Versioned content</VersionBlock>)
    const testElement = screen.getByText(/Versioned content/i)
    expect(testElement).toBeInTheDocument()
  })

  it('Should not render content if current version below firstVersion', () => {
    render(
      <VersionContextProvider>
        <VersionBlock firstVersion="0.99">
          Versioned content
        </VersionBlock>
      </VersionContextProvider>
    )
    const content = screen.getByText('Versioned content')
    expect(content).toBeInTheDocument()
  })
})
