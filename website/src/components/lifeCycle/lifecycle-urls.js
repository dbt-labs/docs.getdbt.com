// plan name variables to use across the docs site
export const MANAGED= 'Enterprise';
export const SELF_SERVICE = 'Team';
export const DEVELOPER = 'Developer';

const PRODUCT_LIFECYCLE_URL = 'https://docs.getdbt.com/docs/dbt-versions/product-lifecycles';
const PLAN_URL = 'https://www.getdbt.com/pricing';

export const STATUS_URLS = {
  [MANAGED]: PLAN_URL,
  [SELF_SERVICE]: PLAN_URL,
  [DEVELOPER]: 'https://www.getdbt.com/signup',
  beta: PRODUCT_LIFECYCLE_URL,
  preview: PRODUCT_LIFECYCLE_URL,
  ga: PRODUCT_LIFECYCLE_URL,
};
