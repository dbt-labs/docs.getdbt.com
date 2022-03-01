import React from 'react'
import { render, screen } from '@testing-library/react';
import Var from './index'

describe("Test Var component", () => {
  it('Should render correct variable from name prop', () => { 
    render(<Var name="dbtCore" />)
    const testElement = screen.getByText('dbt Core')
    expect(testElement).toBeInTheDocument()
  })
})
