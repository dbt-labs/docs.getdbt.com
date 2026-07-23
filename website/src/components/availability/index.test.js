import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Availability from './index';

describe('Availability', () => {
  it('renders nothing for all_users (everywhere + free)', () => {
    const { container } = render(<Availability availability="all_users" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "dbt platform | Free" for platform_free without repeating badge values in the tooltip', async () => {
    const user = userEvent.setup();
    render(<Availability availability="platform_free" />);

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

  it('renders "dbt platform | Developer" for platform_developer', async () => {
    const user = userEvent.setup();
    render(<Availability availability="platform_developer" />);

    const badge = screen.getByRole('button', { name: /dbt platform \| developer/i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Free plan and up.');
  });

  it('joins multiple plans on the badge', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{
          surface: 'platform',
          access: 'paid_plan',
          plans: ['starter', 'enterprise', 'enterprise_plus'],
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

  it('renders "Self-hosted" alone for local_free (free is implicit for self-hosted)', () => {
    render(<Availability availability="local_free" />);
    const badge = screen.getByRole('button', { name: /^self-hosted\./i });
    expect(badge).toHaveTextContent('Self-hosted');
    expect(badge).not.toHaveTextContent('Free');
  });

  it('renders linked local development guidance for local_all', async () => {
    const user = userEvent.setup();
    render(<Availability availability="local_all" />);

    const badge = screen.getByRole('button', {
      name: /^local development \| dbt platform\./i,
    });
    expect(badge).toHaveTextContent('Local development | dbt platform');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent('Runs locally.');
    expect(tooltip).toHaveTextContent('Works with');
    expect(tooltip).toHaveTextContent(
      'Works with dbt platform or open source dbt Core 2.0 projects.'
    );
    expect(
      screen.getByRole('link', { name: 'dbt platform' })
    ).toHaveAttribute('href', '/docs/platform/dbt-cli-installation');
  });

  it('renders all-version local development guidance for local_all_versions', async () => {
    const user = userEvent.setup();
    render(<Availability availability="local_all_versions" />);

    const badge = screen.getByRole('button', {
      name: /^local development \| dbt platform\./i,
    });
    expect(badge).toHaveTextContent('Local development | dbt platform');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent(
      'Works with dbt platform or open source dbt Core projects.'
    );
    expect(tooltip).not.toHaveTextContent('Core 2.0');
    expect(
      screen.getByRole('link', { name: 'dbt platform' })
    ).toHaveAttribute('href', '/docs/platform/dbt-cli-installation');
  });

  it('renders "Self-hosted | Login required" for local_login', () => {
    render(<Availability availability="local_login" />);
    expect(
      screen.getByRole('button', { name: /self-hosted \| login required/i })
    ).toBeInTheDocument();
  });

  it('renders access alone with no surface badge (everywhere_login)', () => {
    render(<Availability availability="everywhere_login" />);
    const badge = screen.getByRole('button', { name: /^login required\./i });
    expect(badge).toHaveTextContent('Login required');
    expect(badge).not.toHaveTextContent('dbt platform');
    expect(badge).not.toHaveTextContent('Self-hosted');
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
    render(<Availability availability="local_login" />);

    await user.tab();

    expect(screen.getByRole('button', { name: /self-hosted \| login required/i })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes when clicking outside the badge', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Availability availability="local_login" />
        <button type="button">Outside</button>
      </>
    );

    await user.click(screen.getByRole('button', { name: /self-hosted \| login required/i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps a clicked tooltip open after mouse leave', async () => {
    const user = userEvent.setup();
    render(<Availability availability="platform_starter" />);

    const badge = screen.getByRole('button', { name: /dbt platform \| starter/i });
    await user.click(badge);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(badge);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
