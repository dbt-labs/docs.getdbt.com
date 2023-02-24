import React from 'react'
import { DiscourseBlogComments } from './index'

const mockResponseData = {
    topicId: 5650,
    comments: [
        {
            id: 9335,
            name: "John Rock",
            username: "john.rock",
            avatar_template:
                "/user_avatar/discourse.getdbt.com/john.rock/{size}/1430_2.png",
            created_at: "2022-12-15T19:37:00.436Z",
            cooked:
                '<p>Testing another comment.</p>\n<blockquote>\n<p>Nasdaq at large has always been a data driven company. Over the years how we access and model data has changed but the desire for data driven outcomes has not.</p>\n</blockquote>\n<pre><code class="lang-auto">      &lt;div&gt;\n        &lt;h2&gt;Comments&lt;/h2&gt;\n        {resultData()}\n      &lt;/div&gt;\n</code></pre>',
            post_number: 2,
            post_type: 1,
            updated_at: "2022-12-15T19:37:00.436Z",
            reply_count: 1,
            reply_to_post_number: null,
            quote_count: 0,
            incoming_link_count: 1,
            reads: 1,
            readers_count: 0,
            score: 10.2,
            yours: false,
            topic_id: 5650,
            topic_slug:
                "how-to-move-data-from-spreadsheets-into-your-data-warehouse",
            display_username: "John Rock",
            primary_group_name: null,
            flair_name: null,
            flair_url: null,
            flair_bg_color: null,
            flair_color: null,
            version: 1,
            can_edit: true,
            can_delete: true,
            can_recover: false,
            can_wiki: true,
            read: false,
            user_title: "dbt Labs",
            title_is_group: false,
            bookmarked: false,
            actions_summary: [
                {
                    id: 2,
                    can_act: true,
                },
                {
                    id: 3,
                    can_act: true,
                },
                {
                    id: 4,
                    can_act: true,
                },
                {
                    id: 8,
                    can_act: true,
                },
                {
                    id: 6,
                    can_act: true,
                },
                {
                    id: 7,
                    can_act: true,
                },
            ],
            moderator: true,
            admin: true,
            staff: true,
            user_id: 3019,
            hidden: false,
            trust_level: 4,
            deleted_at: null,
            user_deleted: false,
            edit_reason: null,
            can_view_edit_history: true,
            wiki: false,
            reviewable_id: 0,
            reviewable_score_count: 0,
            reviewable_score_pending_count: 0,
            mentioned_users: [],
            akismet_state: null,
            user_created_at: "2022-12-08T15:24:08.563Z",
            user_date_of_birth: null,
            can_accept_answer: false,
            can_unaccept_answer: false,
            accepted_answer: false,
        },
    ],
};

describe('Test DiscourseBlogComments component', () => {
    it('Should display loading icon on inital load', () => {
        cy.intercept('GET', '**/.netlify/functions/get-discourse-comments*',
            {
                delayMs: 100,
            }).as('getComments')

        cy.mount(<DiscourseBlogComments
            title={"Processing source tables with differing arrival times throughout day"}
        />)
        cy.get('[data-testid="feed-loader"]', { timeout: 100 }).should('be.visible')
        cy.wait('@getComments')
        cy.get('[data-testid="error-text"]').should('be.visible')

    })

    it('Should display Discourse data after API fetch', () => {
        cy.intercept('GET', '**/.netlify/functions/get-discourse-comments*', mockResponseData).as('getComments')

        cy.mount(<DiscourseBlogComments
            title={"Processing source tables with differing arrival times throughout day"}
        />)
        cy.wait('@getComments')
        cy.get('[data-testid="comments-list"]').as('commentsList')
        cy.get('@commentsList').should('have.length', 1)
        cy.get('@commentsList').eq(0).should('contain.text', 'Testing another comment.')

    })
    it("Should display error message if API fetch fails", () => {
        cy.intercept('GET', '**/.netlify/functions/get-discourse-comments*', {
            statusCode: 404
        }).as('getComments')

        cy.mount(<DiscourseBlogComments
            title={"Processing source tables with differing arrival times throughout day"}
        />)
        cy.wait('@getComments')
        cy.get('[data-testid="error-text"]').should('be.visible')

    });
})
