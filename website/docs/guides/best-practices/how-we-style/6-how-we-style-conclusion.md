---
title: Now it's your turn
id: 6-how-we-style-conclusion
---

## BYO Styles

Now that you've seen how we style our dbt projects, it's time to build your own. Feel free to copy this guide and use it as a template for your own project. If you do, we'd love to hear about it! Reach out to us on [the Community Forum](https://discourse.getdbt.com/c/show-and-tell/22) or [Slack](https://www.getdbt.com/community) to share your style guide. We recommend co-locating your style guide with your code to make sure contributors can easily follow it. If you're using GitHub, you can add your style guide to your repository's wiki, or include it in your README.

## Pre-commit hooks

Lastly, to ensure your style guide's automated rules are being followed without additional mental overhead to your team, you can use [pre-commit hooks](https://pre-commit.com/) to automatically check your code for style violations (and often fix them automagically) before it's committed. This is a great way to make sure your style guide is followed by all contributors. We recommend implementing this once you've settled on and published your style guide, and your codebase is conforming to it. This will ensure that all future commits follow the style guide. You can find an excellent set of open source pre-commit hooks for dbt from the community [here in the dbt-checkpoint project](https://github.com/dbt-checkpoint/dbt-checkpoint).

## Style guide template

```markdown
# dbt Example Style Guide

## SQL style

- Use lowercase keywords.
- Use trailing commas.

## Model Organization

Our models (typically) fit into two main categories:

| Category | Description                                             |
| -------- | ------------------------------------------------------- |
| Staging  | Contains models which clean and standardize data        |
| Marts    | Contains models which combine or heavily transform data |

Things to note:

- There are different types of models
  that typically exist in each of the above categories.
  See [Model Layers](#model-layers) for more information.

- Read [How we structure our dbt projects](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview) for an example and more details around organization.

## Model Layers

- Only models in `staging` should select from [sources](https://docs.getdbt.com/docs/building-a-dbt-project/using-sources).
- Models not within the `staging` folder should select from [refs](https://docs.getdbt.com/reference/dbt-jinja-functions/ref).

## Model File Naming and Coding

- All objects should be plural.  
  Example: `stg_stripe__invoices.sql` vs. `stg_stripe__invoice.sql`

- All models should use the naming convention `<type/dag_stage>_<source/topic>__<additional_context>`. See [this article](https://docs.getdbt.com/blog/stakeholder-friendly-model-names) for more information.

  - Models in the **staging** folder should use the source's name as the `<source/topic>` and the entity name as the `additional_context`.

    Examples:

    - seed_snowflake_spend.csv
    - base_stripe\_\_invoices.sql
    - stg_stripe\_\_customers.sql
    - stg_salesforce\_\_customers.sql
    - int_customers\_\_unioned.sql
    - fct_orders.sql

- Schema, table and column names should be in `snake_case`.

- Limit use of abbreviations that are related to domain knowledge. An onboarding
  employee will understand `current_order_status` better than `current_os`.

- Use names based on the _business_ terminology, rather than the source terminology.

- Each model should have a primary key that can identify the unique row, and should be named `<object>_id`, e.g. `account_id` – this makes it easier to know what `id` is being referenced in downstream joined models.

- For `base` or `staging` models, columns should be ordered in categories, where identifiers are first and date/time fields are at the end.- Date/time columns should be named according to these conventions:

  - Timestamps: `<event>_at`  
    Format: UTC  
    Example: `created_at`

  - Dates: `<event>_date`
    Format: Date  
    Example: `created_date`

- Booleans should be prefixed with `is_` or `has_`.
  Example: `is_active_customer` and `has_admin_access`

- Price/revenue fields should be in decimal currency (e.g. `19.99` for $19.99; many app databases store prices as integers in cents). If non-decimal currency is used, indicate this with suffix, e.g. `price_in_cents`.

- Avoid using reserved words (such as [these](https://docs.snowflake.com/en/sql-reference/reserved-keywords.html) for Snowflake) as column names.

- Consistency is key! Use the same field names across models where possible.
  Example: a key to the `customers` table should be named `customer_id` rather than `user_id`.

## Model Configurations

- Model configurations at the [folder level](https://docs.getdbt.com/reference/model-configs#configuring-directories-of-models-in-dbt_projectyml) should be considered (and if applicable, applied) first.
- More specific configurations should be applied at the model level [using one of these methods](https://docs.getdbt.com/reference/model-configs#apply-configurations-to-one-model-only).
- Models within the `marts` folder should be materialized as `table` or `incremental`.
  - By default, `marts` should be materialized as `table` within `dbt_project.yml`.
  - If switching to `incremental`, this should be specified in the model's configuration.

## Testing

- At a minimum, `unique` and `not_null` tests should be applied to the expected primary key of each model.

## CTEs

For more information about why we use so many CTEs, check out [this glossary entry](https://docs.getdbt.com/terms/cte).

- Where performance permits, CTEs should perform a single, logical unit of work.

- CTE names should be as verbose as needed to convey what they do.

- CTEs with confusing or noteable logic should be commented with SQL comments as you would with any complex functions, and should be located above the CTE.

- CTEs that are duplicated across models should be pulled out and created as their own models.
```
