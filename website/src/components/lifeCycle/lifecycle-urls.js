const PRODUCT_LIFECYCLE_URL = 'https://docs.getdbt.com/docs/dbt-versions/product-lifecycles';
const PLAN_URL = 'https://www.getdbt.com/pricing';

export const STATUS_URLS = {
  enterprise: PLAN_URL,
  team: PLAN_URL,
  developer: 'https://www.getdbt.com/signup',
  beta: PRODUCT_LIFECYCLE_URL,
  preview: PRODUCT_LIFECYCLE_URL,
  ga: PRODUCT_LIFECYCLE_URL,
};
