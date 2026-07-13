// Availability answers two independent questions for the reader:
//   surface: where does this feature live? (local | platform | everywhere/omitted)
//   access:  what do I need to use it? (free | login_required | paid_plan | usage_based)
//
// These facets are independent — either can render without the other. Badges never
// mention an engine (Fusion, Core, OSS) — that distinction doesn't belong here.
//
// Example frontmatter:
//   availability: platform_starter
// or, for multi-plan features:
//   availability:
//     surface: platform
//     access: paid_plan
//     plans: [starter, enterprise, enterprise_plus]

export const FIELD_LABELS = {
  surface: 'Where',
  access: 'Access',
};

export const SURFACE_LABELS = {
  local: 'Local',
  platform: 'dbt platform',
};

export const SURFACE_TOOLTIPS = {
  local: 'Runs locally.',
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
  return `Requires ${planListLabel(plans)} plan.`;
}

// Returns an ordered list of { facet, tooltip } for the access badge/tooltip rows.
export function getAccessFacets(access, plans, surface) {
  switch (access) {
    case 'free':
      // Free is only rendered paired with the platform surface (rule: bare "dbt platform"
      // badge could read as paid). Local/everywhere default to free implicitly.
      return surface === 'platform' ? [{ facet: 'Free', tooltip: ACCESS_TOOLTIPS.Free }] : [];
    case 'login_required':
      return [{ facet: 'Login required', tooltip: ACCESS_TOOLTIPS['Login required'] }];
    case 'usage_based':
      return [
        { facet: 'Login required', tooltip: ACCESS_TOOLTIPS['Login required'] },
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
    description: 'Local tools with no login required.',
    surface: 'local',
    access: 'free',
  },
  local_login: {
    description: 'Local tools that need a free dbt account.',
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
