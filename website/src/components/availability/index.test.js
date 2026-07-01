import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Availability from './index';

describe('Availability', () => {
  it('renders an all-users badge with the engine row', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ preset: 'all_users', engine: 'all_engines' }} />);

    const badge = screen.getByRole('button', { name: /applies to: all users/i });
    expect(badge).toHaveTextContent('Applies to: all users');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Engines');
    expect(tooltip).toHaveTextContent('All engines');
  });

  it('defaults an un-scoped platform preset to all plans', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ preset: 'platform', engine: 'core_and_fusion' }} />);

    const badge = screen.getByRole('button', { name: /applies to: dbt platform · all plans/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Plans');
    expect(tooltip).toHaveTextContent('All dbt platform plans');
  });

  it('scopes a platform preset with the separate plans field', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ preset: 'platform', plans: 'enterprise_and_above', engine: 'not_engine_specific' }}
      />
    );

    const badge = screen.getByRole('button', { name: /applies to: dbt platform · enterprise/i });
    expect(screen.getByText('Enterprise')).toHaveAttribute('data-availability-facet', 'plan');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent('dbt platform');
    expect(tooltip).toHaveTextContent('Plans');
    expect(tooltip).toHaveTextContent('Enterprise and Enterprise+');
    expect(tooltip).toHaveTextContent('Engine');
    expect(tooltip).toHaveTextContent('Not engine-specific');
  });

  it('shows the engine facet on the badge for a single-engine cli preset', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ preset: 'cli', engine: 'fusion' }} />);

    await user.click(screen.getByRole('button', { name: /applies to: cli · fusion/i }));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent('CLI');
    expect(tooltip).toHaveTextContent('Engine');
    expect(tooltip).toHaveTextContent('dbt Fusion');
  });

  it('omits the engine facet from the badge for all_engines / not_engine_specific', async () => {
    render(<Availability availability={{ preset: 'cli', engine: 'all_engines' }} />);

    expect(screen.getByRole('button', { name: /applies to: cli\./i })).toBeInTheDocument();
  });

  it('never renders a lifecycle status row (owned by the H1 pill)', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ preset: 'vscode_extension', engine: 'fusion' }} />);

    const badge = screen.getByRole('button', { name: /vs code extension/i });
    expect(badge).not.toHaveTextContent('Preview');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).not.toHaveTextContent('Status');
    expect(tooltip).not.toHaveTextContent('Preview');
    expect(tooltip).not.toHaveTextContent('Workflow');
  });

  it('accepts a bare preset string', async () => {
    const user = userEvent.setup();
    render(<Availability availability="cli" />);

    await user.click(screen.getByRole('button', { name: /applies to: cli\./i }));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent('CLI');
  });

  it('renders nothing without a resolvable preset', () => {
    const { container } = render(<Availability availability={{ engine: 'fusion' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens on focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ preset: 'cli', engine: 'fusion' }} />);

    await user.tab();

    expect(screen.getByRole('button', { name: /cli · fusion/i })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes when clicking outside the badge', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Availability availability="cli" />
        <button type="button">Outside</button>
      </>
    );

    await user.click(screen.getByRole('button', { name: /applies to: cli\./i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps a clicked tooltip open after mouse leave', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ preset: 'platform', plans: 'starter_and_above' }} />);

    const badge = screen.getByRole('button', { name: /dbt platform · starter and above/i });
    await user.click(badge);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(badge);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
