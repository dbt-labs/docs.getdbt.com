import React from 'react'
import axios from 'axios'
import { render, screen } from '@testing-library/react'
import { DiscourseFeed } from './index'

// Mock api data
const mockAxiosResponse = {
  data: [
    {
      "id": 4911,
      "title": "Processing source tables with differing arrival times throughout day",
      "has_accepted_answer": true,
      "author": "MatthewMunn",
      "like_count": 1,
      "posts_count": 2
    }
  ],
}

describe("Test DiscourseFeed component", () => {
  // returns mocks to original state (ex: window = undefined)
  afterEach(() => jest.restoreAllMocks())

  it('Should render same text passed into title prop', () => { 
    render(<DiscourseFeed title='Open topics' />)
    const testElement = screen.getByText(/Open topics/i)
    expect(testElement).toBeInTheDocument()
  })

  it('Should display loading icon on inital load', () => { 
    render(<DiscourseFeed />)
    const img = screen.getByTestId('feed-loader')
    expect(img).toBeInTheDocument()
  })

  it('Should display Discourse data after API fetch', async () => {
    // Get mock api response
    jest.spyOn(axios, 'post').mockResolvedValueOnce(mockAxiosResponse)

    render(<DiscourseFeed />)
    // Topic "has_accepted_answer" - should display ✅ ahead of title
    const topicCheckMark = await screen.findByText(/✅/i)
    expect(topicCheckMark).toBeInTheDocument()
    
    // Topic title should exist in document
    const topicTitle = await screen.findByText(/Processing source tables/i)
    expect(topicTitle).toBeInTheDocument()

    // Author should display
    const topicAuthor = await screen.findByText(/MatthewMunn/i)
    expect(topicAuthor).toBeInTheDocument()
    
    // Should display reply
    const topicReply = await screen.findByText(/1 reply/i)
    expect(topicReply).toBeInTheDocument()
    
    // Has 1 like, should display '1 like' and not '1 likes'
    const topicLikes = await screen.findByText(/1 like/i)
    expect(topicLikes).toBeInTheDocument()
  })

  it('Should show cta with correct text and href', async () => { 
    // Get mock api response
    jest.spyOn(axios, 'post').mockResolvedValueOnce(mockAxiosResponse)

    render(<DiscourseFeed 
      link_text="See open topics" 
      link_href="https://discourse.getdbt.com/c/help/19" 
      show_cta={true} 
    />)

    const button = await screen.findByTestId('feed-cta')
    const buttonText = await screen.findByText(/See open topics/i)
    const buttonHref = buttonText.closest('a')
    expect(button).toBeInTheDocument()
    expect(buttonText).toBeInTheDocument()
    expect(buttonHref).toHaveAttribute('href', 'https://discourse.getdbt.com/c/help/19')
  })

  it('Should display message when no topics found', async () => { 
    // Get mock api response
    const mockEmptyResponse = {
      data: [],
    }
    jest.spyOn(axios, 'post').mockResolvedValueOnce(mockEmptyResponse)

    render(<DiscourseFeed />)

    const errorText = await screen.findByTestId('error-text')
    expect(errorText).toBeInTheDocument()
  })
})

