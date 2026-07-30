// Availability answers two independent questions for the reader:
//   engine:  which dbt version line does this apply to? (v1 | v2 | all/omitted)
//   surface: where does this feature live? (local | local_development | platform | everywhere/omitted)
//   access:  what do I need to use it? (free | login_required | paid_plan | usage_based)
//
// These facets are independent — any can render without the others.
//
// Example frontmatter:
//   availability: platform_login
// or, for paid-plan features (minPlan is a tier and everything above it — "starter" means starter+):
//   availability:
//     engine: v2
//     surface: platform
//     access: paid_plan
//     minPlan: starter
// plans: [...] is still supported as an explicit list, for the rare feature that
// doesn't follow the tier ladder (e.g. Starter-only, with no Enterprise equivalent).

export const FIELD_LABELS = {
  engine: 'Version',
  surface: 'Where',
  access: 'Access',
  usage: 'Usage',
};

// v1 = dbt Core 1.x (1.99 and earlier). v2 = dbt Fusion engine 2.0 and later.
// "all" (or omitted) means the content applies to both lines — no badge segment renders,
// same hide-if-universal rule used elsewhere in this file.
export const ENGINE_LABELS = {
  v1: 'Available in v1',
  v2: 'Available in v2',
};

export const ENGINE_TOOLTIPS = {
  v1: 'Available in dbt Core 1.x',
  v2: 'Available in v2 (including Fusion)',
};

export function getEngineFacet(engine) {
  const label = ENGINE_LABELS[engine];
  if (!label) {
    return null;
  }
  return { facet: label, tooltip: ENGINE_TOOLTIPS[engine] };
}

// local and local_development render the same "Local development" badge — the
// distinction (CLI-only vs platform-compatible) lives in the tooltip, not the chip.
export const SURFACE_LABELS = {
  local: 'Local development',
  local_development: 'Local development',
  platform: 'dbt platform',
};

export const SURFACE_TOOLTIPS = {
  local: 'Runs locally.',
  local_development: 'Runs locally. Works with dbt platform or local dbt projects.',
  platform: 'Available in the dbt platform.',
};

// Link text within a SURFACE_TOOLTIPS entry, keyed by surface.
export const SURFACE_TOOLTIP_LINKS = {
  local_development: {
    href: '/docs/platform/dbt-cli-installation',
    text: 'dbt platform',
  },
};

export const PLAN_LABELS = {
  starter: 'Starter',
  enterprise: 'Enterprise',
  enterprise_plus: 'Enterprise+',
};

// Order matters: minPlan expands to this tier and everything after it ("and up").
const PLAN_TIER_ORDER = ['starter', 'enterprise', 'enterprise_plus'];

const ACCESS_TOOLTIPS = {
  Free: 'No account needed.',
  'Login required': 'Requires a free dbt account.',
  'Usage-based': 'Billed on usage.',
};

function planListLabel(plans) {
  const labels = plans.map((plan) => PLAN_LABELS[plan] || plan);
  if (labels.length <= 1) {
    return labels.join('');
  }
  return `${labels.slice(0, -1).join(', ')}, ${labels[labels.length - 1]}`;
}

function planTooltip(plans) {
  return `Requires ${planListLabel(plans)}.`;
}

// minPlan is the common case: a tier and everything above it ("starter" -> starter+enterprise+enterprise_plus).
// plans is an explicit list, for the rare feature that doesn't follow the tier ladder.
function resolvePlans(minPlan, plans) {
  if (minPlan) {
    const index = PLAN_TIER_ORDER.indexOf(minPlan);
    return index === -1 ? [] : PLAN_TIER_ORDER.slice(index);
  }
  return plans && plans.length ? plans : [];
}

// Returns an ordered list of { facet, tooltip } for the access badge/tooltip rows.
export function getAccessFacets(access, { minPlan, plans } = {}, surface) {
  switch (access) {
    case 'free':
      // Free is only rendered paired with the platform surface (rule: bare "dbt platform"
      // badge could read as paid). Local development/everywhere default to free implicitly.
      return surface === 'platform' ? [{ facet: 'Free', tooltip: ACCESS_TOOLTIPS.Free }] : [];
    case 'login_required':
      // On the platform surface, "Login required" is redundant — you can't use dbt
      // platform without an account, so it's collapsed away (same pattern as "free" above).
      // Local development/everywhere still show it since login isn't implied there.
      return surface === 'platform' ? [] : [{ facet: 'Login required', tooltip: ACCESS_TOOLTIPS['Login required'] }];
    case 'usage_based':
      return [
        ...(surface === 'platform' ? [] : [{ facet: 'Login required', tooltip: 'Sign in with a dbt account. Available on all plan types.' }]),
        { facet: 'Usage-based', tooltip: ACCESS_TOOLTIPS['Usage-based'], label: FIELD_LABELS.usage },
      ];
    case 'paid_plan': {
      const planList = resolvePlans(minPlan, plans);
      if (!planList.length) {
        return [];
      }
      return [{ facet: planListLabel(planList), tooltip: planTooltip(planList) }];
    }
    default:
      return [];
  }
}

export const availabilityPresets = {
  all_users: {
    description: 'Applies to every dbt user, regardless of surface. No badge is rendered.',
    access: 'free',
  },
  platform_login: {
    description: 'dbt platform features available to all signed-in users.',
    surface: 'platform',
    access: 'login_required',
  },
  local_free: {
    description: 'Local CLI tools with no login required.',
    surface: 'local',
    access: 'free',
  },
  local_all: {
    description: 'Local tools for open-source dbt Core and dbt platform-connected projects, any version.',
    surface: 'local_development',
  },
  everywhere_usage: {
    description: 'Cross-surface features that need a dbt account and are billed on usage.',
    access: 'usage_based',
  },
};
