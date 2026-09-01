import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Availability from './index';

describe('Availability', () => {
  it('renders nothing for all_users (everywhere + free)', () => {
    const { container } = render(<Availability availability="all_users" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "dbt platform | Free" for an explicit free platform access without repeating badge values in the tooltip', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: 'platform', access: 'free' }} />);

    const badge = screen.getByRole('button', { name: /dbt platform \| free/i });
    expect(badge).toHaveTextContent('dbt platform | Free');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent('Available in the dbt platform.');
    expect(tooltip).toHaveTextContent('Access');
    expect(tooltip).toHaveTextContent('No account needed.');
    expect(tooltip).not.toHaveTextContent('dbt platform —');
    expect(tooltip).not.toHaveTextContent('Free —');
  });

  it('renders "dbt platform" alone for platform_login (login is implicit on the platform surface)', async () => {
    render(<Availability availability="platform_login" />);
    const badge = screen.getByRole('button', { name: /^dbt platform\./i });
    expect(badge).toHaveTextContent('dbt platform');
    expect(badge).not.toHaveTextContent('Login required');
  });

  it('renders both surfaces for a multi-surface feature', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: ['local', 'platform'] }} />);
    const badge = screen.getByRole('button', { name: /local development \| dbt platform/i });
    expect(badge).toHaveTextContent('Local development | dbt platform');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Runs locally.');
    expect(tooltip).toHaveTextContent('Available in the dbt platform.');
  });

  it('expands minPlan to the tier and everything above it', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{
          surface: 'platform',
          access: 'paid_plan',
          minPlan: 'starter',
        }}
      />
    );

    const badge = screen.getByRole('button', {
      name: /dbt platform \| starter, enterprise, enterprise\+/i,
    });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Requires Starter, Enterprise, Enterprise+.');
    expect(tooltip).not.toHaveTextContent('Starter, Enterprise, Enterprise+ —');
  });

  it('still supports an explicit plans list for the rare non-ladder feature', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', plans: ['starter'] }}
      />
    );

    const badge = screen.getByRole('button', { name: /dbt platform \| starter/i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Requires Starter.');
  });

  it('labels the v2 engine facet and renders its tooltip row', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ engine: 'v2', surface: 'platform', access: 'free' }} />);

    const badge = screen.getByRole('button', { name: /available in v2 \| dbt platform \| free/i });
    expect(badge).toHaveTextContent('Available in v2 | dbt platform | Free');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Version');
    expect(tooltip).toHaveTextContent('Available in v2 (including Fusion)');
    expect(tooltip).not.toHaveTextContent('Available in v2 —');
  });

  it('renders "Available in v1" alone with its tooltip for engine-only availability', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ engine: 'v1' }} />);

    const badge = screen.getByRole('button', { name: /^available in v1\./i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Available in dbt Core 1.x');
  });

  it('renders nothing extra for an unknown or omitted engine value', () => {
    const { container } = render(<Availability availability={{ engine: 'all' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Local development" alone for local_free (free is implicit for local CLI)', () => {
    render(<Availability availability="local_free" />);
    const badge = screen.getByRole('button', { name: /^local development\./i });
    expect(badge).toHaveTextContent('Local development');
    expect(badge).not.toHaveTextContent('Free');
  });

  it('renders linked local development guidance for local_all as a single badge chip', async () => {
    const user = userEvent.setup();
    render(<Availability availability="local_all" />);

    const badge = screen.getByRole('button', {
      name: /^local development\./i,
    });
    expect(badge).toHaveTextContent('Local development');
    expect(badge).not.toHaveTextContent('dbt platform');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent(
      'Runs locally. Works with dbt platform or local dbt projects.'
    );
    expect(
      screen.getByRole('link', { name: 'dbt platform' })
    ).toHaveAttribute('href', '/docs/platform/dbt-cli-installation');
  });

  it('renders "Local development | Login required" for a local surface with login required', () => {
    render(<Availability availability={{ surface: 'local', access: 'login_required' }} />);
    expect(
      screen.getByRole('button', { name: /local development \| login required/i })
    ).toBeInTheDocument();
  });

  it('renders access alone with no surface badge (login required, no surface)', () => {
    render(<Availability availability={{ access: 'login_required' }} />);
    const badge = screen.getByRole('button', { name: /^login required\./i });
    expect(badge).toHaveTextContent('Login required');
    expect(badge).not.toHaveTextContent('dbt platform');
    expect(badge).not.toHaveTextContent('Local development');
  });

  it('drops the redundant "Login required" chip but keeps "Usage-based" when surface is platform', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: 'platform', access: 'usage_based' }} />);

    const badge = screen.getByRole('button', { name: /^dbt platform \| usage-based\./i });
    expect(badge).not.toHaveTextContent('Login required');

    await user.click(badge);
    expect(screen.getByRole('tooltip')).not.toHaveTextContent('Login required');
  });

  it('renders "Login required | Usage-based" for everywhere_usage (dbt State case)', async () => {
    const user = userEvent.setup();
    render(<Availability availability="everywhere_usage" />);

    const badge = screen.getByRole('button', { name: /login required \| usage-based/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Requires a free dbt account.');
    expect(tooltip).toHaveTextContent('Billed on usage.');
  });

  it('never renders Fusion, Core, or OSS anywhere in badge output', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', plans: ['starter', 'enterprise', 'enterprise_plus'] }}
      />
    );

    const badge = screen.getByRole('button', { name: /dbt platform/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).not.toMatch(/fusion|core|oss/i);
    expect(badge.textContent).not.toMatch(/fusion|core|oss/i);
  });

  it('accepts "platform" as shorthand for availability to all dbt platform users', () => {
    render(<Availability availability="platform" />);

    const badge = screen.getByRole('button', { name: /^dbt platform\./i });
    expect(badge).toHaveTextContent('dbt platform');
    expect(badge).not.toHaveTextContent('Free');
    expect(badge).not.toHaveTextContent('Login required');
  });

  it('treats a platform surface without access as available to all platform users', () => {
    render(<Availability availability={{ surface: 'platform' }} />);

    const badge = screen.getByRole('button', { name: /^dbt platform\./i });
    expect(badge).toHaveTextContent('dbt platform');
    expect(badge).not.toHaveTextContent('Free');
  });

  it('renders nothing without a resolvable surface or access', () => {
    const { container } = render(<Availability availability={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens on focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ surface: 'local', access: 'login_required' }} />);

    await user.tab();

    expect(screen.getByRole('button', { name: /local development \| login required/i })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes when clicking outside the badge', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Availability availability={{ surface: 'local', access: 'login_required' }} />
        <button type="button">Outside</button>
      </>
    );

    await user.click(screen.getByRole('button', { name: /local development \| login required/i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps a clicked tooltip open after mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', minPlan: 'starter' }}
      />
    );

    const badge = screen.getByRole('button', { name: /dbt platform \| starter/i });
    await user.click(badge);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(badge);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
