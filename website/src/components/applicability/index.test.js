import React from 'react';
import { render, screen } from '@testing-library/react';
import Applicability from './index';

describe('Applicability', () => {
  it('renders an all-user signal when content applies to all surfaces, plans, and engines', () => {
    render(
      <Applicability surface="both" plan="all" engine="both" />
    );

    expect(screen.getByLabelText('Page applicability')).toHaveTextContent('Applies to all users');
  });

  it('renders a platform signal with an all Enterprise tiers plan pill', () => {
    render(<Applicability surface="platform" plan="enterprise+" />);

    expect(screen.getByLabelText('Page applicability')).toHaveTextContent('Applies to dbt platform');
    expect(screen.getByText('All Enterprise tiers')).toBeInTheDocument();
  });

  it('renders an all plans pill when platform content is available on all plans', () => {
    render(<Applicability surface="platform" plan="all" />);

    expect(screen.getByLabelText('Page applicability')).toHaveTextContent('Applies to dbt platform');
    expect(screen.getByText('All plans')).toBeInTheDocument();
    expect(screen.queryByText('Developer+')).not.toBeInTheDocument();
    expect(screen.queryByText('Starter+')).not.toBeInTheDocument();
    expect(screen.queryByText('Enterprise+')).not.toBeInTheDocument();
  });

  it('renders a local development signal and ignores plan props', () => {
    render(<Applicability surface="local" plan="enterprise+" />);

    expect(screen.getByLabelText('Page applicability')).toHaveTextContent('Applies to local development');
    expect(screen.queryByText('All Enterprise tiers')).not.toBeInTheDocument();
  });

  it('renders an OSS-only signal and ignores plan props', () => {
    render(<Applicability surface="oss" plan="enterprise+" />);

    expect(screen.getByLabelText('Page applicability')).toHaveTextContent('Applies to OSS only');
    expect(screen.queryByText('All Enterprise tiers')).not.toBeInTheDocument();
  });

  it('renders restricted engines and omits all-engine signals', () => {
    const { rerender } = render(<Applicability surface="platform" engine="fusion" />);

    expect(screen.getByText('Fusion')).toBeInTheDocument();

    rerender(<Applicability surface="platform" engine="both" />);

    expect(screen.queryByText('Fusion')).not.toBeInTheDocument();
    expect(screen.queryByText(/all engines/i)).not.toBeInTheDocument();
  });
});
