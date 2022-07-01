const sizes = ['iphone-x', [768, 1024], [1280, 720]]

describe('docs.getdbt.com', () => {
  before(function () {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
    cy.viewport(1280, 720)
  });

  beforeEach(() => {
    cy.visit('/');
  });

  sizes.forEach((size) => {
    it('verifies all the button links work and go to the correct page', () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      cy.get('[style="max-width:var(--ifm-container-width);margin:calc(2vh) auto calc(2vh)"] > :nth-child(1) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/docs/introduction`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get('[style="max-width:var(--ifm-container-width);margin:calc(2vh) auto calc(2vh)"] > :nth-child(2) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/guides/getting-started`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get('[style="max-width:var(--ifm-container-width);margin:calc(2vh) auto calc(2vh)"] > :nth-child(3) > .card > .card__footer > .button').invoke('removeAttr', 'target').click()
      cy.url().should('eq', 'https://www.getdbt.com/dbt-learn/')
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', 'https://docs.getdbt.com/')
      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/docs/introduction`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/reference/dbt_project.yml`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(3) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/docs/faqs`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(4) > :nth-child(1) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/docs/dbt-cloud/cloud-overview`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(4) > :nth-child(2) > .card > .card__footer > .button').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/docs/dbt-cloud/dbt-cloud-api/cloud-apis`)
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(2) > :nth-child(1) > .card > .card__footer > .button').contains('Get Advice').invoke('removeAttr', 'target').click()
      cy.url().should('eq', 'https://discourse.getdbt.com/')
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(2) > :nth-child(2) > .card > .card__footer > .button').contains('Join us on Slack').then(($button => {
        cy.wrap($button).should('have.attr', 'href').and('eq', 'http://community.getdbt.com/')
        cy.wrap($button).invoke('removeAttr', 'target').click()
        cy.url().should('eq', 'https://www.getdbt.com/community/')
      }))
      cy.get('body').should('not.contain', 'Page Not Found')
      cy.go('back')
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
      cy.get(':nth-child(2) > :nth-child(3) > .card > .card__footer > .button').contains('View Projects').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}/faqs/project/example-projects`)
      cy.get('body').should('not.contain', 'Page Not Found')
    })
  })
})