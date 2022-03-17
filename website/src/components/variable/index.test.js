import React from 'react'
import { render, screen } from '@testing-library/react';
import Var from './index'

describe("Test Var component", () => {
  it('Should render correct variable from name prop', () => { 
    render(<Var name="exampleString" />)
    const testElement = screen.getByText('Example String')
    expect(testElement).toBeInTheDocument()
  })
})
