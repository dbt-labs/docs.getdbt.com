import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Applicability from './index';

describe('Applicability', () => {
  it('renders an all-user signal for legacy broad applicability', async () => {
    const user = userEvent.setup();
    render(
      <Applicability surface="both" plan="all" engine="both" />
    );

    const badge = screen.getByRole('button', { name: /applies to: all users/i });
    expect(badge).toHaveTextContent('Applies to: all users');

    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Availability');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Applies to all users');
  });

  it('renders a platform Enterprise badge with structured plan details from legacy props', async () => {
    const user = userEvent.setup();
    render(<Applicability surface="platform" plan="enterprise+" />);

    const badge = screen.getByRole('button', { name: /applies to: dbt platform · enterprise/i });
    expect(badge).toHaveTextContent('Applies to: dbt platform · Enterprise');
    expect(screen.queryByText('Enterprise+')).not.toBeInTheDocument();

    await user.click(badge);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Plans');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Enterprise and Enterprise+');
  });

  it('renders all plans for legacy platform content available to every plan', () => {
    render(<Applicability surface="platform" plan="all" />);

    expect(screen.getByRole('button', { name: /applies to: dbt platform · all plans/i })).toBeInTheDocument();
    expect(screen.queryByText('Developer+')).not.toBeInTheDocument();
    expect(screen.queryByText('Starter+')).not.toBeInTheDocument();
  });

  it('renders restricted engines in legacy mode', () => {
    const { rerender } = render(<Applicability surface="platform" engine="fusion" />);

    expect(screen.getByRole('button', { name: /fusion/i })).toBeInTheDocument();

    rerender(<Applicability surface="platform" engine="both" />);

    expect(screen.queryByText(/fusion/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/all engines/i)).not.toBeInTheDocument();
  });

  it('renders preset availability with structured tooltip rows', async () => {
    const user = userEvent.setup();
    render(
      <Applicability
        availability={{
          preset: 'vscode_fusion_preview',
          registration: [
            'All features are available for 14 days without registration',
            'Advanced features require free dbt platform registration after trial',
          ],
        }}
      />
    );

    const badge = screen.getByRole('button', { name: /applies to: vs code extension · fusion/i });
    expect(badge).toBeInTheDocument();

    await user.hover(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Product');
    expect(tooltip).toHaveTextContent('dbt VS Code extension');
    expect(tooltip).toHaveTextContent('Engine');
    expect(tooltip).toHaveTextContent('dbt Fusion engine');
    expect(tooltip).toHaveTextContent('Registration');
    expect(tooltip).toHaveTextContent('Advanced features require free dbt platform registration after trial');
  });

  it('supports explicit badge overrides and object metadata', async () => {
    const user = userEvent.setup();
    render(
      <Applicability
        availability={{
          badge: 'Applies to: Multiple surfaces · Core and Fusion',
          workflow: ['Local development', 'dbt platform development'],
          surface: ['VS Code', 'CLI', 'dbt platform'],
          engine: 'core_and_fusion',
          partial_support: ['Some advanced features require registration'],
        }}
      />
    );

    const badge = screen.getByRole('button', { name: /multiple surfaces · core and fusion/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Local development; dbt platform development');
    expect(tooltip).toHaveTextContent('VS Code; CLI; dbt platform');
    expect(tooltip).toHaveTextContent('Engines');
    expect(tooltip).toHaveTextContent('dbt Core Python engine and dbt Fusion engine');
    expect(tooltip).toHaveTextContent('Partial support');
  });

  it('omits duplicate product and surface rows for platform availability', async () => {
    const user = userEvent.setup();
    render(
      <Applicability
        availability={{
          preset: 'platform_enterprise',
          feature: 'dbt Insights',
          engine: 'not_engine_specific',
          excludes: ['dbt Core-only workflows', 'local CLI workflows'],
        }}
      />
    );

    const badge = screen.getByRole('button', { name: /dbt platform · enterprise/i });
    expect(screen.getByText('Enterprise')).toHaveAttribute('data-availability-facet', 'plan');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Product');
    expect(tooltip).toHaveTextContent('Feature');
    expect(tooltip).toHaveTextContent('Plans');
    expect(tooltip).toHaveTextContent('Engine');
    expect(tooltip).not.toHaveTextContent('Surface');
    expect(tooltip).not.toHaveTextContent('Workflow');
    expect(tooltip).not.toHaveTextContent('License');
    expect(tooltip).not.toHaveTextContent('Optional');
  });

  it('renders plan facets for Wizard platform availability', async () => {
    const user = userEvent.setup();
    render(<Applicability availability="wizard_platform" />);

    const badge = screen.getByRole('button', { name: /dbt platform · dbt wizard · starter and above/i });
    expect(screen.getByText('Starter and above')).toHaveAttribute('data-availability-facet', 'plan');

    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Product');
    expect(tooltip).toHaveTextContent('dbt Wizard');
    expect(tooltip).toHaveTextContent('Plans');
    expect(tooltip).toHaveTextContent('Starter, Enterprise, and Enterprise+');
    expect(tooltip).toHaveTextContent('Public preview');
  });

  it('renders dbt State availability across surfaces and engines', async () => {
    const user = userEvent.setup();
    render(
      <Applicability
        availability={{
          preset: 'dbt_state',
          notes: ['Requires a dbt platform account or standalone dbt State account'],
          excludes: ['legacy Starter plan accounts'],
        }}
      />
    );

    const badge = screen.getByRole('button', { name: /dbt state · core and fusion · preview/i });
    await user.click(badge);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Product');
    expect(tooltip).toHaveTextContent('dbt State');
    expect(tooltip).toHaveTextContent('Surface');
    expect(tooltip).toHaveTextContent('Multiple surfaces');
    expect(tooltip).toHaveTextContent('Engines');
    expect(tooltip).toHaveTextContent('dbt Core Python engine and dbt Fusion engine');
    expect(tooltip).toHaveTextContent('Requires a dbt platform account or standalone dbt State account');
    expect(tooltip).toHaveTextContent('legacy Starter plan accounts');
  });

  it('opens on focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Applicability availability="cli_all_engines" />);

    await user.tab();

    expect(screen.getByRole('button', { name: /cli · all engines/i })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes when clicking outside the badge', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Applicability availability="dbt_core_oss" />
        <button type="button">Outside</button>
      </>
    );

    await user.click(screen.getByRole('button', { name: /dbt core/i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
