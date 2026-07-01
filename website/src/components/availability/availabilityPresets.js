// Availability answers one question for the reader: "who is this page for?"
//
// Three independent choices, each a flat list — pick one value from each that applies:
//   preset: which surface (all_users | platform | cli | vscode_extension)
//   plans:  which plan tier (only meaningful when preset: platform)
//   engine: which engine
//
// The badge is composed automatically from whichever of these are set — writers
// never write badge text, and lifecycle status stays on the H1 <Lifecycle> pill
// instead of being duplicated here.
//
// Example frontmatter:
//   availability:
//     preset: platform
//     plans: enterprise_and_above
//     engine: not_engine_specific

export const FIELD_LABELS = {
  engine: 'Engine',
  engines: 'Engines',
  plans: 'Plans',
  surface: 'Where',
};

export const SURFACE_LABELS = {
  platform: 'dbt platform',
  cli: 'CLI',
  vscode: 'VS Code extension',
};

export const VALUE_LABELS = {
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
};
