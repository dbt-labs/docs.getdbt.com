import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Availability from './index';

describe('Availability', () => {
  it('renders nothing for all_users (everywhere + free)', () => {
    const { container } = render(<Availability availability="all_users" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "dbt platform · Free" for platform_free', async () => {
    const user = userEvent.setup();
    render(<Availability availability="platform_free" />);

    const badge = screen.getByRole('button', { name: /dbt platform · free/i });
    expect(badge).toHaveTextContent('dbt platform · Free');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Where');
    expect(tooltip).toHaveTextContent('dbt platform');
    expect(tooltip).toHaveTextContent('Access');
    expect(tooltip).toHaveTextContent('Free');
  });

  it('renders "dbt platform · Login required" for platform_login', async () => {
    render(<Availability availability="platform_login" />);
    expect(
      screen.getByRole('button', { name: /dbt platform · login required/i })
    ).toBeInTheDocument();
  });

  it('renders "dbt platform · Developer" for platform_developer', async () => {
    const user = userEvent.setup();
    render(<Availability availability="platform_developer" />);

    const badge = screen.getByRole('button', { name: /dbt platform · developer/i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Free plan and up.');
  });

  it('joins multiple plans on the badge', async () => {
    const user = userEvent.setup();
    render(
      <Availability
        availability={{ surface: 'platform', access: 'paid_plan', plans: ['enterprise', 'enterprise_plus'] }}
      />
    );

    const badge = screen.getByRole('button', { name: /dbt platform · enterprise, enterprise\+/i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Requires Enterprise, Enterprise+ plan.');
  });

  it('leads the badge with the engine facet and renders its tooltip row', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ engine: 'v2', surface: 'platform', access: 'free' }} />);

    const badge = screen.getByRole('button', { name: /v2 · dbt platform · free/i });
    expect(badge).toHaveTextContent('v2 · dbt platform · Free');

    await user.click(badge);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Version');
    expect(tooltip).toHaveTextContent('v2');
    expect(tooltip).toHaveTextContent('dbt 2.0 and later, including Fusion.');
  });

  it('renders "v1" alone with its tooltip for engine-only availability', async () => {
    const user = userEvent.setup();
    render(<Availability availability={{ engine: 'v1' }} />);

    const badge = screen.getByRole('button', { name: /^v1\./i });
    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('dbt Core 1.x (1.99 and earlier).');
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

  it('renders "Self-hosted · Login required" for local_login', () => {
    render(<Availability availability="local_login" />);
    expect(
      screen.getByRole('button', { name: /self-hosted · login required/i })
    ).toBeInTheDocument();
  });

  it('renders access alone with no surface badge (everywhere_login)', () => {
    render(<Availability availability="everywhere_login" />);
    const badge = screen.getByRole('button', { name: /^login required\./i });
    expect(badge).toHaveTextContent('Login required');
    expect(badge).not.toHaveTextContent('dbt platform');
    expect(badge).not.toHaveTextContent('Self-hosted');
  });

  it('renders "Login required · Usage-based" for everywhere_usage (dbt State case)', async () => {
    const user = userEvent.setup();
    render(<Availability availability="everywhere_usage" />);

    const badge = screen.getByRole('button', { name: /login required · usage-based/i });
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

  it('defaults an unset platform access to free with a console warning', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Availability availability={{ surface: 'platform' }} />);

    expect(screen.getByRole('button', { name: /dbt platform · free/i })).toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('renders nothing without a resolvable surface or access', () => {
    const { container } = render(<Availability availability={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens on focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Availability availability="local_login" />);

    await user.tab();

    expect(screen.getByRole('button', { name: /self-hosted · login required/i })).toHaveFocus();
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

    await user.click(screen.getByRole('button', { name: /self-hosted · login required/i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps a clicked tooltip open after mouse leave', async () => {
    const user = userEvent.setup();
    render(<Availability availability="platform_starter" />);

    const badge = screen.getByRole('button', { name: /dbt platform · starter/i });
    await user.click(badge);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(badge);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
