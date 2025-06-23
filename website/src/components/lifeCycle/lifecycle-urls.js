// plan name variables to use across the docs site
export const MANAGED_PLUS= 'Enterprise +';
export const MANAGED= 'Enterprise';
export const SELF_SERVICE = 'Starter';
export const DEVELOPER = 'Developer';
export const LEGACY = 'Legacy';

const PRODUCT_LIFECYCLE_URL = 'https://docs.getdbt.com/docs/dbt-versions/product-lifecycles';
const PLAN_URL = 'https://www.getdbt.com/pricing';

export const STATUS_URLS = {
  [MANAGED_PLUS]: PLAN_URL,
  [MANAGED]: PLAN_URL,
  [SELF_SERVICE]: PLAN_URL,
  [DEVELOPER]: 'https://www.getdbt.com/signup',
  [LEGACY]: PRODUCT_LIFECYCLE_URL,
  beta: PRODUCT_LIFECYCLE_URL,
  preview: PRODUCT_LIFECYCLE_URL,
  ga: PRODUCT_LIFECYCLE_URL,
};
