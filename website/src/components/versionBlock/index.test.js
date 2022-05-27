import React from 'react'
import { render, screen } from '@testing-library/react';
import { fail } from 'assert';
import VersionBlock from './index'
import { VersionContextProvider } from '../../stores/VersionContext'

describe("Test VersionBlock component", () => {
  // returns mocks to original state (ex: window = undefined)
  afterEach(() => jest.restoreAllMocks())

  it('Should render same text passed into title prop', () => { 
    render(<VersionBlock>Versioned content</VersionBlock>)
    const testElement = screen.getByText(/Versioned content/i)
    expect(testElement).toBeInTheDocument()
  })

  it.each([
    [
      'Should render content if current version >= firstVersion',
      "0.21",
      true
    ],
    [
      'Should not render content if current version less than firstVersion',
      "0.20",
      false
    ],
  ])('%s', (desc, version, shouldShowContent) => {
    // '%s' prints first arg in each array
    // '%s %s' prints first two args in each array
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(version)

    const firstVersion = "0.21"
    render(
      <VersionContextProvider>
        <VersionBlock firstVersion={firstVersion}>
          Current version
        </VersionBlock>
      </VersionContextProvider>
    )
    const content = screen.queryByText(/current version/i)
    shouldShowContent 
     ? expect(content).toBeInTheDocument()
     : expect(content).not.toBeInTheDocument()
  })
})

