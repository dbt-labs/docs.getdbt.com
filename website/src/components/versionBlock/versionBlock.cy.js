import React from 'react'
import VersionBlock from './index.js'
// import { mount } from '@cypress/react'
// import VersionContextProvider from '../../stores/VersionContext.js'

describe('Test VersionBlock component', () => {
  it('Should render same text passed into title prop', () => {
    cy.mount(<VersionBlock>Versioned content</VersionBlock>)
    cy.contains('Versioned content').should('be.visible')
  })
  // Developer note:
  // Need to figure out how to mount muliple components
  // -----------------
  // const testData = [
  //   {
  //     desc: 'Should render content if current version >= firstVersion',
  //     version: "0.21",
  //     shouldShowContent: true
  //   },
  //   {
  //     desc: 'Should not render content if current version less than firstVersion',
  //     version: "0.20",
  //     shouldShowContent: false
  //   },
  // ]
  // testData.forEach((testCase) => {
  //   it(testCase.desc, () => {
  //     localStorage.setItem('dbtVersion', testCase.version)
  //     const firstVersion = "0.21"

  //     mount(
  //       <VersionContextProvider>
  //         <VersionBlock firstVersion={firstVersion}>
  //           Current version
  //         </VersionBlock>
  //       </VersionContextProvider>
  //     )
  //     cy.contains('Current version').should('be.visible')
  //   })
  // })
})