import React from 'react'
import { DiscourseFeed } from './index'

const mockResponseData = [
    {
        "id": 4911,
        "title": "Processing source tables with differing arrival times throughout day",
        "has_accepted_answer": true,
        "author": "MatthewMunn",
        "like_count": 1,
        "posts_count": 2
    },
]

describe('Test Discourse component', () => {
    it('Should render same text passed into title prop', () => {
        cy.mount(<DiscourseFeed title='Open topics' />)
        cy.contains('Open topics').should('be.visible')
    })

    it('Should display loading icon on inital load', () => {
        cy.intercept('POST', '**/.netlify/functions/get-discourse-topics', {
            delayMs: 100,
        }
        ).as('getTopics')
        cy.mount(<DiscourseFeed />)
        cy.get('[data-testid="feed-loader"]', { timeout: 100 }).should('be.visible')
        cy.wait('@getTopics')
        cy.get('[data-testid="error-text"]').should('be.visible')

    })

    it('Should display Discourse data after API fetch', () => {
        cy.intercept('POST', '**/.netlify/functions/get-discourse-topics', (req) => {
            req.reply(mockResponseData);
        }).as('getTopics')

        cy.mount(<DiscourseFeed />)
        cy.wait('@getTopics')
        cy.get('[data-testid="topics-list"]').as('topicsList')
        cy.get('@topicsList').should('have.length', 1)
        cy.get('@topicsList').eq(0).get('span[title="Solved"]').should('be.visible')
        cy.get('@topicsList').eq(0).should('contain.text', 'Processing source tables')
        cy.get('@topicsList').eq(0).contains('MatthewMunn').should('be.visible')
        cy.get('@topicsList').eq(0).contains('1 reply').should('be.visible')
        cy.get('@topicsList').eq(0).contains('1 like').should('be.visible')
    })

    it('Should show cta with correct text and href', () => {
        cy.intercept('POST', '**/.netlify/functions/get-discourse-topics', (req) => {
            req.reply(mockResponseData);
        }).as('getTopics')

        cy.mount(<DiscourseFeed
            link_text="See open topics"
            link_href="https://discourse.getdbt.com/c/help/19"
            show_cta={true}
        />)
        cy.wait('@getTopics')

        cy.get('[data-testid="feed-cta"]').as('btn')
        cy.get('@btn').should('exist')
        cy.get('@btn').invoke('attr', 'href').should('eq', 'https://discourse.getdbt.com/c/help/19')
        cy.get('@btn').invoke('attr', 'title').should('eq', 'See open topics')
    })

    it('Should display message when no topics found', () => {
        cy.intercept('POST', '**/.netlify/functions/get-discourse-topics', (req) => {
            req.reply([]);
        }).as('getTopics')

        cy.mount(<DiscourseFeed />)
        cy.wait('@getTopics')
        cy.get('[data-testid="error-text"]').should('be.visible')

    })
})
