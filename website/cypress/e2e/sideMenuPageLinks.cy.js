// This test is really expensive with time to run 
// Note should not be part of ci but can be run locally. 

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
  it('verifies sidebar menu has the correct level one items', () => {
    // > li yields list items 
    const menuItems = [
      'Supported data platforms',
      'dbt support',
      'Get started with dbt',
      'Build dbt projects',
      'Deploy dbt projects',
      'Collaborate with others',
      'Use the dbt Semantic Layer',
      'Available dbt versions',
      'dbt support',
      'Frequently asked questions',
    ]
    cy.get('.theme-doc-sidebar-menu > li').as('listItems')

    menuItems.forEach(item => {
      cy.get('@listItems').contains(item).should('exist')
    })
  })

  it('verifies level one menu page links work and go to the correct pages', () => {
    // > li yields liste items 
    cy.get('.theme-doc-sidebar-menu > li').as('listItems')

    cy.get('@listItems').contains('Supported data platforms').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/supported-data-platforms`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('@listItems').contains('dbt support').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/dbt-support`, `${Cypress.config('baseUrl')}/docs/introduction`)
  })

  it('verifies /get started with dbt/ sub menu page links work and go to the correct pages', () => {
    // > li yields liste items 
    const menuItems = [
      'About getting started',
      'Get started with dbt Cloud',
      'Get started with dbt Core',
      'Run your dbt projects',
    ]
    const subMenuA = [
      'About set up',
      'Getting set up',
      'Building your first project',
      'PrivateLink',
      'Learning more',
      'dbt Cloud features',
      'Develop in Cloud',
      'dbt Cloud tips',
    ]
    let items = []

    cy.get('.theme-doc-sidebar-menu > li').as('listItems')
    cy.get('@listItems').contains('Get started with dbt').as('listItem')
    cy.get('@listItem').click()
    cy.get('@listItem').parent().parent().as('subMenu')

    menuItems.forEach(item => {
      cy.get('@subMenu').contains(item).should('be.visible')
    })
    cy.get('@subMenu').contains('About getting started').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/getting-started/overview`, `${Cypress.config('baseUrl')}/docs/introduction`)

    cy.get('@subMenu').contains('Run your dbt projects').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/run-your-dbt-projects`, `${Cypress.config('baseUrl')}/docs/introduction`)

    // test all /Get started with dbt Cloud/ items are valid 
    cy.get('@subMenu').contains('Get started with dbt Cloud').click()

    cy.get('@subMenu').contains('About set up').as('subMenuItem')
    cy.get('@subMenuItem').click()
    cy.get('@subMenuItem').parent().parent().as('subMenuA')
    subMenuA.forEach(item => {
      cy.get('@subMenuA').contains(item).should('be.visible')
    })

    // verify  /get set up/  page links work
    cy.get('@subMenuA').contains('About set up').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/getting-started/set-up-dbt-cloud`, `${Cypress.config('baseUrl')}/docs/introduction`)
    cy.get('@subMenuA').contains('dbt Cloud feature').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/dbt-cloud-features`, `${Cypress.config('baseUrl')}/docs/introduction`)
    cy.get('@subMenuA').contains('Connect your database').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/connect-your-database`, `${Cypress.config('baseUrl')}/docs/introduction`)
    cy.get('@subMenuA').contains('Develop in Cloud').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/develop-in-the-cloud`, `${Cypress.config('baseUrl')}/docs/introduction`)
    cy.get('@subMenuA').contains('dbt Cloud tips').click()
    cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}/docs/get-started/dbt-cloud-tips`, `${Cypress.config('baseUrl')}/docs/introduction`)

    // verifies /Getting set up/ page links work
    items = [
      {
        title: 'Set up and connect BigQuery',
        slug: '/docs/get-started/getting-started/getting-set-up/setting-up-bigquery'
      },
      {
        title: 'Set up and connect Databricks',
        slug: '/docs/get-started/getting-started/getting-set-up/setting-up-databricks'
      },
      {
        title: 'Set up and connect Redshift',
        slug: '/docs/get-started/getting-started/getting-set-up/setting-up-redshift'
      },
      {
        title: 'Set up and connect Snowflake',
        slug: '/docs/get-started/getting-started/getting-set-up/setting-up-snowflake'
      },

    ]
    // navigate to subMenu
    cy.get('@subMenuA').contains('Getting set up').as('subMenuItemAA')
    cy.get('@subMenuItemAA').click()
    cy.get('@subMenuItemAA').parent().parent().as('subMenuAA')
    // check visibility and links
    items.forEach(item => {
      cy.get('@subMenuAA').contains(item.title).should('be.visible')
      cy.get('@subMenuAA').contains(item.title).click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}${item.slug}`, `${Cypress.config('baseUrl')}/docs/introduction`)

    })
    cy.get('@subMenuItemAA').click()

    // verifiest /Building your first project/ page links work
    items = [
      {
        title: 'Build your first models',
        slug: '/docs/get-started/getting-started/building-your-first-project/build-your-first-models'
      },
      {
        title: 'Test and document your project',
        slug: '/docs/get-started/getting-started/building-your-first-project/test-and-document-your-project'
      },
      {
        title: 'Schedule a job',
        slug: '/docs/get-started/getting-started/building-your-first-project/schedule-a-job'
      },
    ]
    // navigate to subMenu
    cy.get('@subMenuA').contains('Building your first project').as('subMenuItemAB')
    cy.get('@subMenuItemAB').click()
    cy.get('@subMenuItemAB').parent().parent().as('subMenuAB')
    // check visibility and links
    items.forEach(item => {
      cy.get('@subMenuAB').contains(item.title).should('be.visible')
      cy.get('@subMenuAB').contains(item.title).click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}${item.slug}`, `${Cypress.config('baseUrl')}/docs/introduction`)

    })
    cy.get('@subMenuItemAB').click()

    //verifies /PrivateLink/ page links work

    items = [
      {
        title: 'About PrivateLink',
        slug: '/docs/get-started/privatelink/about-privatelink'
      },
      {
        title: 'PrivateLink for Snowflake',
        slug: '/docs/get-started/privatelink/snowflake-privatelink'
      },
      {
        title: 'PrivateLink for Redshift',
        slug: '/docs/get-started/privatelink/redshift-privatelink'
      },
      {
        title: 'PrivateLink for Databricks',
        slug: '/docs/get-started/privatelink/databricks-privatelink'
      },
    ]
    // navigate to subMenu
    cy.get('@subMenuA').contains('PrivateLink').as('subMenuItemAC')
    cy.get('@subMenuItemAC').click()
    cy.get('@subMenuItemAC').parent().parent().as('subMenuAC')
    // check visibility and links
    items.forEach(item => {
      cy.get('@subMenuAC').contains(item.title).should('be.visible')
      cy.get('@subMenuAC').contains(item.title).click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}${item.slug}`, `${Cypress.config('baseUrl')}/docs/introduction`)

    })
    cy.get('@subMenuItemAC').click()

    // verifies /learning more/ page links work  
    items = [
      {
        title: 'Using Jinja',
        slug: '/guides/advanced/using-jinja'
      },
      {
        title: 'Refactoring legacy SQL to dbt',
        slug: '/guides/migration/tools/refactoring-legacy-sql'
      },
    ]
    // navigate to subMenu
    cy.get('@subMenuA').contains('Learning more').as('subMenuItemAD')
    cy.get('@subMenuItemAD').click()
    cy.get('@subMenuItemAD').parent().parent().as('subMenuAD')
    // check visibility and links
    items.forEach(item => {
      cy.get('@subMenuAD').contains(item.title).should('be.visible')
      cy.get('@subMenuAD').contains(item.title).click()
      cy.checkLinksNotBroken(`${Cypress.config('baseUrl')}${item.slug}`, `${Cypress.config('baseUrl')}/docs/introduction`)

    })
    cy.get('@subMenuItemAD').click()

  })


})
