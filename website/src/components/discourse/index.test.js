import React from 'react'
import { render, screen } from '@testing-library/react';
import { DiscourseFeed, DiscourseHelpFeed } from './index'

describe("Test DiscourseFeed component", () => {
  // returns mocks to original state (ex: window = undefined)
  afterEach(() => jest.restoreAllMocks())

  it('Should render same text passed into title prop', () => { 
    render(<DiscourseFeed title='Open topics' />)
    const testElement = screen.getByText(/Open topics/i)
    expect(testElement).toBeInTheDocument()
  })

  it('Should display loading icon on inital load', () => { 
    const { container } = render(<DiscourseFeed />)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
  })
})

