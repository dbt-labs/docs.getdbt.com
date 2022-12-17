const sizes = ['iphone-x', [768, 1024], [1280, 720]]

describe('docs.getdbt.com homepage', () => {
  before(function () {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
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
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/introduction`, `${Cypress.config('baseUrl')}/`)
      
      cy.get('[style="max-width:var(--ifm-container-width);margin:calc(2vh) auto calc(2vh)"] > :nth-child(2) > .card > .card__footer > .button').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/guides/getting-started`, `${Cypress.config('baseUrl')}/`)
      
      cy.get('[style="max-width:var(--ifm-container-width);margin:calc(2vh) auto calc(2vh)"] > :nth-child(3) > .card > .card__footer > .button').invoke('removeAttr', 'target').click()
      cy.checkLinksNotBroken('https://www.getdbt.com/dbt-learn/', `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > .card > .card__footer > .button').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/introduction`, `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .card > .card__footer > .button').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/reference/dbt_project.yml`, `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(3) > .card > .card__footer > .button').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(4) > :nth-child(1) > .card > .card__footer > .button').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/dbt-cloud/cloud-overview`, `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(4) > :nth-child(2) > .card > .card__footer > .button').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/dbt-cloud/dbt-cloud-api/cloud-apis`, `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(2) > :nth-child(1) > .card > .card__footer > .button').contains('Get Advice').invoke('removeAttr', 'target').click()
      cy.checkLinksNotBroken('https://discourse.getdbt.com/', `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(2) > :nth-child(2) > .card > .card__footer > .button').contains('Join us on Slack').then(($button => {
        cy.wrap($button).should('have.attr', 'href').and('eq', 'http://community.getdbt.com/')
        cy.wrap($button).invoke('removeAttr', 'target').click()
      }))
      cy.checkLinksNotBroken('https://www.getdbt.com/community/', `${Cypress.config('baseUrl')}/`)

      cy.get(':nth-child(2) > :nth-child(3) > .card > .card__footer > .button').contains('View Projects').click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/project/example-projects`, `${Cypress.config('baseUrl')}/`)
    })
  })
})