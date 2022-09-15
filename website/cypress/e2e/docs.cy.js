describe('docs.getdbt.com docs tab', () => {
  before(function () {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
  });

  beforeEach(() => {
    cy.visit('/docs/introduction');
  });

  it('verifies all the introduction page links work and go to the correct pages', () => {
    cy.get(':nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/supported-data-platforms`, `${Cypress.config('baseUrl')}/docs/introduction`)
    
    cy.get(':nth-child(1) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/core-versions`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the building a dbt project page links work and go to the correct pages', () => {
    cy.get('.theme-doc-sidebar-menu > :nth-child(2) > :nth-child(1) > .menu__link').click()
    cy.get(':nth-child(2) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/projects`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(2) > .menu__list > .theme-doc-sidebar-item-category > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models/materializations`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models/configuring-incremental-models`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models/using-custom-aliases`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models/using-custom-schemas`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models/using-custom-databases`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > .theme-doc-sidebar-item-category > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/building-models/using-variables`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/tests`, `${Cypress.config('baseUrl')}/docs/introduction`)
    
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/documentation`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/using-sources`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/seeds`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/snapshots`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(8) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/exposures`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(9) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/jinja-macros`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(10) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/hooks-operations`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(11) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/package-management`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(12) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/analyses`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 350ms ease-in-out 0s;"] > :nth-child(13) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/building-a-dbt-project/metrics`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the running a dbt project page links work and go to the correct pages', () => {
    cy.get(':nth-child(3) > .menu__list-item-collapsible > .menu__link').click()
    cy.get(':nth-child(3) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/running-a-dbt-project/using-the-dbt-ide`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(3) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/running-a-dbt-project/using-the-cli`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(3) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/running-a-dbt-project/dbt-api`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(3) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/running-a-dbt-project/running-dbt-in-production`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the contributing page links work and go to the correct pages', () => {
    cy.get(':nth-child(4) > .menu__list-item-collapsible > .menu__link').click()
    cy.get(':nth-child(4) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/contributing/oss-expectations`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(4) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/contributing/contributor-license-agreements`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(4) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/contributing/building-a-new-adapter`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(4) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/contributing/testing-a-new-adapter`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(4) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/contributing/documenting-a-new-adapter`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(4) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/contributing/slack-rules-of-the-road`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the about page links work and go to the correct pages', () => {
    cy.get(':nth-child(5) > .menu__list-item-collapsible > .menu__link').click()
    cy.get(':nth-child(5) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/about/license`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get(':nth-child(5) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/about/viewpoint`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - accounts page links work and go to the correct pages', () => {
    // frequently asked questions collapsible section takes the user
    // to an index page
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)
    
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Accounts/change-billing`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Accounts/configurable-snapshot-path`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Accounts/dbt-specific-jinja`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Accounts/git-account-in-use`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Accounts/payment-accepted`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(1) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Accounts/slack`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - core page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(2) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(2) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Core/install-pip-best-practices.md`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(2) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Core/install-pip-os-prereqs.md`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(2) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Core/install-python-compatibility`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - docs page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(3) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(3) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Docs/document-all-columns`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(3) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Docs/document-other-resources`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(3) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Docs/documenting-macros`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(3) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Docs/long-descriptions`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(3) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Docs/sharing-documentation`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - environments page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(4) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(4) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Environments/beta-release`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(4) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Environments/diff-database-environment`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(4) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Environments/profile-env-vars`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(4) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Environments/profile-name`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(4) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Environments/target-names`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - git page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Git/gitignore`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Git/gitlab-authentication`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Git/gitlab-selfhosted`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Git/google-cloud-repo`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Git/managed-repo`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(5) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Git/run-on-pull`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - jinja page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(6) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Jinja/jinja-whitespace`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(6) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Jinja/quoting-column-names`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(6) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Jinja/which-jinja-docs`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - models page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/available-configurations`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/available-materializations`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/configurable-model-path`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/create-a-schema`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/create-dependencies`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/insert-records`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/model-custom-schemas`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(8) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/reference-models-in-another-project`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(9) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/removing-deleted-models`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(10) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/run-downtime`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(11) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/source-quotes`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(12) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/specifying-column-types`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(13) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/sql-dialect`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(7) > .menu__list > :nth-child(14) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Models/unique-model-names`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - project page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/dbt-source-freshness`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/debugging-jinja`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/define-a-column-type`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/docs-for-multiple-projects`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/example-projects`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/exclude-table-from-freshness`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/multiple-resource-yml-files`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(8) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/project-name`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(9) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/properties-not-in-config`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(10) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/resource-yml-name`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(11) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/schema-yml-name`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(12) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/separate-profile`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(13) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/source-has-bad-name`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(14) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/source-in-different-database`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(15) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/structure-a-project`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(16) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/which-materialization`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(17) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/which-schema`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(18) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/why-not-write-dml`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(19) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/why-so-many-macros`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(20) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/why-version-2`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(8) > .menu__list > :nth-child(21) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Project/yaml-file-extension`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - runs page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/checking-logs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/failed-prod-run`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/failed-tests`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/run-downstream-of-seed`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/run-one-model`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/run-one-snapshot`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/running-model-downstream-of-source`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(9) > .menu__list > :nth-child(8) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Runs/snapshot-frequency`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - seeds page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/build-one-seed`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/full-refresh-seed`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/leading-zeros-in-seed`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/load-raw-data-with-seed`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/seed-custom-schemas`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/seed-datatypes`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(10) > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Seeds/seed-hooks`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - snapshots page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(11) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(11) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Snapshots/snapshot-hooks`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(11) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Snapshots/snapshot-schema-changes`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(11) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Snapshots/snapshot-target-schema`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(11) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Snapshots/snapshotting-freshness-for-one-source`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - tests page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/available-tests`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/configurable-data-path`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/configurable-data-test-path`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/custom-test-thresholds`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/recommended-tests`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/test-one-model`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/testing-seeds`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(8) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/testing-sources`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(9) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/uniqueness-two-columns`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(12) > .menu__list > :nth-child(10) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Tests/when-to-test`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - troubleshooting page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/access-gdrive-credential`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/access_token_error`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/dispatch-could-not-find-package`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/git-revlist-error`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/gitignore`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/gitlab-authentication`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(7) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/nonetype-ide-error`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(8) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/partial-parsing-error`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(9) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/runtime-error-could-not-find-profile`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(10) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/runtime-packages.yml`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(11) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/sql-errors`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(13) > .menu__list > :nth-child(12) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Troubleshooting/unused-model-configurations`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies all the frequently asked questions - warehouse page links work and go to the correct pages', () => {
    cy.get(':nth-child(6) > .menu__list-item-collapsible > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/faqs`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list-item-collapsible > .menu__link').click()
    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list > :nth-child(1) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Warehouse/bq-impersonate-service-account-setup`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list > :nth-child(2) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Warehouse/bq-impersonate-service-account-why`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list > :nth-child(3) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Warehouse/connecting-to-two-dbs-not-allowed`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list > :nth-child(4) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Warehouse/database-privileges`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list > :nth-child(5) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Warehouse/loading-data`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('[style="display: block; overflow: visible; height: auto; will-change: height; transition: height 357ms ease-in-out 0s;"] > :nth-child(14) > .menu__list > :nth-child(6) > .menu__link').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/faqs/Warehouse/sample-profiles`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })
})