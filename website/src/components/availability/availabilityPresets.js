// Availability answers one question for the reader: "who is this page for?"
//
// Independent, reusable enums — pick one value from each that applies:
//   preset:    which audience/surface (all_users | platform | cli | vscode_extension | dbt_state)
//   plans:     which plan tier (only meaningful when preset: platform)
//   engine:    which engine
//   account:   account/entitlement gating that isn't exactly a plan (rare — most pages skip this)
//   access:    billing/consumption model (rare — most pages skip this)
//
// account and access are short controlled values, not free text, so a new feature with
// unusual gating (paid add-on, entitlement, trial) reuses an existing value instead of a
// writer inventing a new sentence. Pricing detail still belongs in prerequisites, not here.
//
// The badge is composed automatically from whichever of these are set — writers never
// write badge text, and lifecycle status stays on the H1 <Lifecycle> pill instead of
// being duplicated here.
//
// Example frontmatter:
//   availability:
//     preset: platform
//     plans: enterprise_and_above
//     engine: not_engine_specific

export const FIELD_LABELS = {
  access: 'Access',
  account: 'Available to',
  engine: 'Engine',
  engines: 'Engines',
  plans: 'Plans',
  surface: 'Where',
};

export const SURFACE_LABELS = {
  local_and_platform: 'Local development; dbt platform',
  platform: 'dbt platform',
  cli: 'CLI',
  vscode: 'VS Code extension',
};

// A label can be a plain string, or a function of (merged) for wording that depends on
// another field (for example, naming the feature in an account requirement).
export const VALUE_LABELS = {
  account: {
    dbt_platform_account: 'dbt platform account',
    standalone_account: (merged) =>
      merged.feature ? `Standalone ${merged.feature} account` : 'Standalone account',
    platform_or_standalone: (merged) =>
      merged.feature
        ? `dbt platform account or standalone ${merged.feature} account`
        : 'dbt platform account or standalone account',
  },
  access: {
    included: 'Included with your plan',
    free_registration: 'Free with registration',
    trial_then_paid: 'Free trial, then paid',
    paid_usage: 'Paid, usage-based',
    paid_usage_after_trial: 'Free trial, usage-based after trial',
    entitlement_required: 'Requires entitlement',
    contact_sales: 'Contact sales',
    preview_access: 'Preview access',
  },
  engine: {
    all_engines: 'All engines',
    core_python: 'dbt Core (Python)',
    fusion: 'dbt Fusion',
    core_and_fusion: 'dbt Core (Python) and dbt Fusion',
    not_engine_specific: 'Not engine-specific',
  },
  plans: {
    all_platform_plans: 'All dbt platform plans',
    starter_and_above: 'Starter, Enterprise, and Enterprise+',
    enterprise_and_above: 'Enterprise and Enterprise+',
    enterprise_plus: 'Enterprise+ only',
    none: 'No dbt platform plan required',
  },
  surface: SURFACE_LABELS,
};

// Short forms used only in the badge (the tooltip uses the fuller VALUE_LABELS above).
export const PLAN_BADGE_LABELS = {
  all_platform_plans: 'All plans',
  starter_and_above: 'Starter and above',
  enterprise_and_above: 'Enterprise',
  enterprise_plus: 'Enterprise+',
};

export const ENGINE_BADGE_LABELS = {
  all_engines: 'All engines',
  core_python: 'Core (Python)',
  fusion: 'Fusion',
  core_and_fusion: 'Core and Fusion',
  not_engine_specific: 'Not engine-specific',
};

export const availabilityPresets = {
  all_users: {
    description: 'Applies to every dbt user, regardless of surface or plan.',
  },
  platform: {
    description: 'dbt platform pages. Add `plans` to scope to a tier, otherwise it applies to all plans.',
    surface: 'platform',
  },
  cli: {
    description: 'CLI / local development pages, on any engine.',
    surface: 'cli',
  },
  vscode_extension: {
    description: 'dbt VS Code extension pages.',
    surface: 'vscode',
  },
  dbt_state: {
    description:
      'dbt State pages: cross-surface, all engines, à la carte on Starter/Enterprise+ or standalone (not Legacy Teams), usage-based after a free trial.',
    feature: 'dbt State',
    surface: 'local_and_platform',
    engine: 'all_engines',
    account: 'platform_or_standalone',
    access: 'paid_usage_after_trial',
  },
};
