import React from 'react';
import { render, screen, within } from '@testing-library/react';
import AvailabilityMatrix from './index';

describe('AvailabilityMatrix', () => {
  it('renders engine availability across OSS and dbt platform surfaces', () => {
    render(
      <AvailabilityMatrix
        rows={[
          {
            engine: 'Fusion',
            oss: { state: 'ga' },
            platform: { state: 'ga', plan: 'enterprise+' },
          },
          {
            engine: 'Core (Python)',
            oss: { state: 'none' },
            platform: { state: 'preview' },
          },
        ]}
      />
    );

    expect(screen.getByText('OSS / CLI')).toBeInTheDocument();
    expect(screen.getByText('dbt platform')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Not supported')).toBeInTheDocument();
  });

  it('renders connection availability states for Core (Python) and Fusion', () => {
    render(
      <AvailabilityMatrix
        type="connection"
        rows={[
          {
            label: 'Databricks',
            href: '/docs/platform/connect-data-platform/connect-databricks',
            core: { state: 'ga' },
            fusion: { state: 'private-preview' },
          },
          {
            label: 'Snowflake',
            core: { state: 'ga' },
            fusion: { state: 'ga' },
          },
          {
            label: 'Apache Spark',
            core: { state: 'ga' },
            fusion: { state: 'none' },
          },
        ]}
      />
    );

    expect(screen.getByText('Core (Python)')).toBeInTheDocument();
    expect(screen.getByText('Fusion')).toBeInTheDocument();
    expect(screen.getAllByText('Yes')).toHaveLength(4);
    expect(screen.getByText('Private preview')).toBeInTheDocument();
    expect(screen.getByText('Not supported')).toBeInTheDocument();

    const databricks = screen.getByRole('link', { name: 'Databricks' });
    expect(databricks).toHaveAttribute('href', '/docs/platform/connect-data-platform/connect-databricks');
  });

  it('renders nothing when rows are empty', () => {
    const { container } = render(<AvailabilityMatrix rows={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('keeps plan tags inside the relevant availability cell', () => {
    render(
      <AvailabilityMatrix
        rows={[
          {
            engine: 'Fusion',
            oss: { state: 'ga' },
            platform: { state: 'ga', plan: 'starter+' },
          },
        ]}
      />
    );

    const platformCell = screen.getByText('Starter and above').closest('td');

    expect(within(platformCell).getByText('Yes')).toBeInTheDocument();
    expect(within(platformCell).getByText('Starter and above')).toBeInTheDocument();
  });

  it('renders all-plan availability without Developer+ ambiguity', () => {
    render(
      <AvailabilityMatrix
        rows={[
          {
            engine: 'Core (Python)',
            oss: { state: 'none' },
            platform: { state: 'ga', plan: 'developer+' },
          },
        ]}
      />
    );

    expect(screen.getByText('All plans')).toBeInTheDocument();
    expect(screen.queryByText('Developer+')).not.toBeInTheDocument();
  });
});
