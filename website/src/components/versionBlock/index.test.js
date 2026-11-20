import React from 'react'
import { render, screen } from '@testing-library/react';
import { fail } from 'assert';
import VersionBlock from './index'
import { VersionContextProvider } from '../../stores/VersionContext'
import Admonition from '@theme/Admonition'
import Tabs from '@theme/Tabs'

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

describe("VersionBlock border", () => {
  const boxed = (container) => container.querySelector('fieldset')

  it('boxes versioned block content by default', () => {
    const { container } = render(<VersionBlock firstVersion="1.0"><p>Block</p></VersionBlock>)
    expect(boxed(container)).not.toBeNull()
  })

  it('does not box inline content', () => {
    const { container } = render(<VersionBlock firstVersion="1.0"> and <code>x</code></VersionBlock>)
    expect(boxed(container)).toBeNull()
  })

  it('does not box when the only content is a callout', () => {
    const { container } = render(<VersionBlock firstVersion="1.0">{'\n'}<Admonition /></VersionBlock>)
    expect(boxed(container)).toBeNull()
  })

  it('does not box when the only content is a list', () => {
    const { container } = render(<VersionBlock firstVersion="1.0"><ul><li>one</li><li>two</li></ul></VersionBlock>)
    expect(boxed(container)).toBeNull()
  })

  it('boxes a list that sits next to text', () => {
    const { container } = render(<VersionBlock firstVersion="1.0"><p>Intro</p><ul><li>one</li></ul></VersionBlock>)
    expect(boxed(container)).not.toBeNull()
  })

  it('keeps one border when the only content is tabs', () => {
    const { container } = render(<VersionBlock firstVersion="1.0"><Tabs /></VersionBlock>)
    expect(boxed(container)).toHaveAttribute('data-tabs-only')
  })

  it('does not collapse the tabs border when other content is present', () => {
    const { container } = render(<VersionBlock firstVersion="1.0"><p>Intro</p><Tabs /></VersionBlock>)
    expect(boxed(container)).not.toHaveAttribute('data-tabs-only')
  })

  it('border="off" never boxes', () => {
    const { container } = render(<VersionBlock firstVersion="1.0" border="off"><p>Block</p></VersionBlock>)
    expect(boxed(container)).toBeNull()
  })

  it('border="on" boxes even a callout', () => {
    const { container } = render(<VersionBlock firstVersion="1.0" border="on"><Admonition /></VersionBlock>)
    expect(boxed(container)).not.toBeNull()
  })

  it('never boxes an unversioned block', () => {
    const { container } = render(<VersionBlock border="on"><p>Block</p></VersionBlock>)
    expect(boxed(container)).toBeNull()
  })
})
