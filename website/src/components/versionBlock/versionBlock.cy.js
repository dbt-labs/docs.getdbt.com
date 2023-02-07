import React from 'react'
import VersionBlock from './index.js'
import VersionContextProvider from '../../stores/VersionContext.js'

describe('Test VersionBlock component', () => {
  it('Should render same text passed into title prop', () => {
    cy.mount(<VersionBlock>Versioned content</VersionBlock>)
    cy.contains('Versioned content').should('be.visible')
  })
})