import React from 'react'
import VersionBlock from './index.js'
import VersionContext from '../../stores/VersionContext.js'

describe('Test VersionBlock component', () => {
  it('Should render same text passed into title prop', () => {
    cy.mount(<VersionBlock>Versioned content</VersionBlock>)
    cy.contains('Versioned content').should('be.visible')
  })
  it('Should render content if current version >= firstVersion', () => {
    cy.mount(
      <VersionContext.Provider value={{ version: '1.0' }}>
        <VersionBlock firstVersion={'0.9'}>
          Current version
        </VersionBlock>
      </VersionContext.Provider>
    )
    cy.contains('Current version').should('exist')
  })

  it('Should not render content if current version less than firstVersion', () => {
    cy.mount(
      <VersionContext.Provider value={{ version: '1.0' }}>
        <VersionBlock firstVersion={'1.1'}>
          Current version
        </VersionBlock>
      </VersionContext.Provider>
    )
    cy.contains('Current version').should('not.exist')
  })
})