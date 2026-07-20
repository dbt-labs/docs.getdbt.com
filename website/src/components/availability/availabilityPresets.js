// Availability answers three independent questions for the reader:
//   engine:  which dbt version line does this apply to? (v1 | v2 | all/omitted)
//   surface: where does this feature live? (local/self-hosted | platform | everywhere/omitted)
//   access:  what do I need to use it? (free | login_required | paid_plan | usage_based)
//
// These facets are independent — any can render without the others.
//
// Example frontmatter:
//   availability: platform_starter
// or, for multi-plan features:
//   availability:
//     engine: v2
//     surface: platform
//     access: paid_plan
//     plans: [starter, enterprise, enterprise_plus]

export const FIELD_LABELS = {
  engine: 'Version',
  surface: 'Where',
  access: 'Access',
};

// v1 = dbt Core 1.x (1.99 and earlier). v2 = dbt 2.0 and later, including Fusion.
// "all" (or omitted) means the content applies to both lines — no badge segment renders,
// same hide-if-universal rule used elsewhere in this file.
export const ENGINE_LABELS = {
  v1: 'v1',
  v2: 'v2',
};

export const ENGINE_TOOLTIPS = {
  v1: 'dbt Core 1.x',
  v2: 'dbt 2.0+',
};

export function getEngineFacet(engine) {
  const label = ENGINE_LABELS[engine];
  if (!label) {
    return null;
  }
  return { facet: label, tooltip: ENGINE_TOOLTIPS[engine] };
}

export const SURFACE_LABELS = {
  local: 'Self-hosted',
  platform: 'dbt platform',
};

export const SURFACE_TOOLTIPS = {
  local: 'Runs on your own infrastructure.',
  platform: 'Available in the dbt platform.',
};

export const PLAN_LABELS = {
  developer: 'Developer',
  starter: 'Starter',
  enterprise: 'Enterprise',
  enterprise_plus: 'Enterprise+',
};

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
  if (plans.length === 1 && plans[0] === 'developer') {
    return 'Free plan and up.';
  }
  return `Requires ${planListLabel(plans)}.`;
}

// Returns an ordered list of { facet, tooltip } for the access badge/tooltip rows.
export function getAccessFacets(access, plans, surface) {
  switch (access) {
    case 'free':
      // Free is only rendered paired with the platform surface (rule: bare "dbt platform"
      // badge could read as paid). Self-hosted/everywhere default to free implicitly.
      return surface === 'platform' ? [{ facet: 'Free', tooltip: ACCESS_TOOLTIPS.Free }] : [];
    case 'login_required':
      // On the platform surface, "Login required" is redundant — you can't use dbt
      // platform without an account, so it's collapsed away (same pattern as "free" above).
      // Self-hosted/everywhere still show it since login isn't implied there.
      return surface === 'platform' ? [] : [{ facet: 'Login required', tooltip: ACCESS_TOOLTIPS['Login required'] }];
    case 'usage_based':
      return [
        ...(surface === 'platform' ? [] : [{ facet: 'Login required', tooltip: ACCESS_TOOLTIPS['Login required'] }]),
        { facet: 'Usage-based', tooltip: ACCESS_TOOLTIPS['Usage-based'] },
      ];
    case 'paid_plan': {
      const planList = plans && plans.length ? plans : [];
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
  platform_free: {
    description: 'dbt platform features with no login or plan requirement.',
    surface: 'platform',
    access: 'free',
  },
  platform_login: {
    description: 'dbt platform features that need a free dbt account, but no paid plan.',
    surface: 'platform',
    access: 'login_required',
  },
  platform_developer: {
    description: 'dbt platform features available on the free Developer plan and up.',
    surface: 'platform',
    access: 'paid_plan',
    plans: ['developer'],
  },
  platform_starter: {
    description: 'dbt platform features gated to the Starter plan and up.',
    surface: 'platform',
    access: 'paid_plan',
    plans: ['starter'],
  },
  platform_enterprise: {
    description: 'dbt platform features gated to the Enterprise plan.',
    surface: 'platform',
    access: 'paid_plan',
    plans: ['enterprise'],
  },
  platform_enterprise_plus: {
    description: 'dbt platform features gated to the Enterprise+ plan.',
    surface: 'platform',
    access: 'paid_plan',
    plans: ['enterprise_plus'],
  },
  local_free: {
    description: 'Self-hosted tools with no login required.',
    surface: 'local',
    access: 'free',
  },
  local_login: {
    description: 'Self-hosted tools that need a free dbt account.',
    surface: 'local',
    access: 'login_required',
  },
  everywhere_login: {
    description: 'Cross-surface features that need a free dbt account, but no paid plan.',
    access: 'login_required',
  },
  everywhere_usage: {
    description: 'Cross-surface features that need a dbt account and are billed on usage.',
    access: 'usage_based',
  },
};
