---
title: "How to cost-effectively use warehouse AI functions in your dbt project"
description: "AI functions in SQL are easy to write and equally easy to overspend on. Here are four strategies to keep the bill under control."
slug: ai-function-guardrails
image: /img/blog/2026-11-26-ai-function-guardrails/jaffle-games-shop-storefront.webp
authors: [benoit_perigaud, doug_beatty, mirna_wong]
tags: [ai]
hide_table_of_contents: false
date: 2026-12-04
is_featured: false
---

Warehouse-provided SQL functions are easy to write – they feel just like normal SQL! But their cost structure makes it easy to overspend, especially if you re-process every record in dev, then CI, then every day once it reaches production.

For example, it's GTA VI launch time at Jaffle Games Shop, an online game store. Orders are flying and customer reviews are pouring in, and it's getting hard to keep up!

Someone on the data team has a good idea: categorize reviews into common themes, so the team can see what customers are talking about. So they add a `AI_CLASSIFY()` function call to the reviews table. After they've finished iterating in dev, they open a PR to kick off a CI run, and head out to play GTA over lunch – blissfully unaware of the cost implications of this change.

This post covers four patterns to make that work more cost-effective, powered by standard dbt features: 

- Using sampling in dev and CI
- Estimating total cost before deploying
- Building incrementally
- Protecting against full refreshes

<Lightbox src="/img/blog/2026-11-26-ai-function-guardrails/jaffle-games-shop-storefront.webp" width="85%" title="The Jaffle Games Shop storefront on a nice, sunny day!" />

<!-- truncate -->

## Why AI functions get expensive

Your normal intuition for what's expensive on a warehouse won't directly transfer to AI functions like Cortex's `AI_COMPLETE` and `AI_CLASSIFY`. They're billed by the token, which is a function of how much text you send and get back. Classifying 50k tweet-length reviews might take 4 million tokens (maybe $10-12), while the same number of support tickets could be 1-2 orders of magnitude higher. 

Those costs reflect a single run – the bill keeps ticking up as you iterate in development, then run CI checks, and finally deploy to a daily production build.

At Jaffle Games Shop, customers write reviews in the store's review tool. Fivetran ingests them into the warehouse, where they land as raw data. From there, dbt takes over:

1. A staging model, `stg_reviews`, tidies them up.
2. A second model, `reviews_classified`, calls an AI function once for each review. You give the function a review and a list of topics, and it answers with the topic that fits best. For example, "My download code never arrived!" comes back as "order problems".

<Lightbox src="/img/blog/2026-11-26-ai-function-guardrails/reviews-flow.webp" width="100%" title="The reviews DAG: raw.reviews flows into stg_reviews, which flows into reviews_classified" />

Note: the examples in this post use Snowflake Cortex functions, but the underlying dbt patterns are consistent regardless of the platform you're using.

## 1. Sample a handful of rows

During development and CI, it's unnecessary to classify every single record on every single `dbt run`, when you just need to check that the system is working as expected. The data team at Jaffle Games Shop changed their `reviews_classified` model to only classify 50 random reviews outside of production environments. Here's how they did it:

```sql
select
    review_id,
    review_text,
    ai_classify(
        review_text,
        ['delivery', 'order problems', 'price', 'gameplay', 'bugs']
    ) as classification,
    _fivetran_synced

from {{ ref('stg_reviews') }}

-- this is the guardrail: outside production, only classify 50 random reviews
{% if env_var('DBT_CLOUD_ENVIRONMENT_TYPE', '') != 'prod' %}
    qualify row_number() over (order by random()) <= 50
{% endif %}
```

dbt platform [automatically sets](/docs/build/environment-variables#special-environment-variables) `DBT_CLOUD_ENVIRONMENT_TYPE`. You can choose a different environment variable or filter on `target.name` – anything that differentiates one environment from another is fine. Specifying a default value `''` prevents the dbt invocation from failing if it's not set.

## 2. Check the price on a small sample first

Before deploying to production, the team should sense-check the cost of tagging the full reviews table. The 50-row sample run provides concrete spend data that can be extrapolated.

The following tabs provide example queries to fetch AI consumption for some common warehouses:

<Tabs>

<TabItem value="snowflake" label="Snowflake">

This query shows today's AI function usage:

```sql
-- After a small test run, check what was spent:
with spend as (
    select
        function_name,
        sum(credits) as credits_used,
        count(distinct query_id) as queries
    from snowflake.account_usage.cortex_ai_functions_usage_history
    where start_time >= current_date  -- filter to today
    group by 1
),
tokens as (
    select
        u.function_name,
        sum(m.value:value::int) as total_tokens
    from snowflake.account_usage.cortex_ai_functions_usage_history u,
        lateral flatten(input => u.metrics) m
    where u.start_time >= current_date  -- filter to today
        and m.value:key:unit::string = 'tokens'
    group by 1
)
select
    s.function_name,
    round(s.credits_used, 4) as credits_used,
    round(s.credits_used * 2.22, 2) as estimated_cost_usd,  -- replace 2.22 with your price per credit
    t.total_tokens,
    s.queries
from spend s
left join tokens t on s.function_name = t.function_name
order by s.credits_used desc;
```

Usage in `cortex_ai_functions_usage_history` can take a few [minutes](https://docs.snowflake.com/en/sql-reference/account-usage/cortex_ai_functions_usage_history) to show up. The credits don't include the compute of the warehouse that ran your query, which is billed separately. Some functions, like `AI_CLASSIFY`, report one total token count instead of separate input and output counts, so the query adds the token counts together.

</TabItem>

<TabItem value="databricks" label="Databricks">


This query shows today's AI function usage:

```sql
-- After a small test run, check what was spent:
select
    u.product_features.ai_functions.ai_function as function_name,
    sum(u.usage_quantity) as dbus_used,
    round(sum(u.usage_quantity * p.pricing.effective_list.default), 2) as estimated_cost_usd,
    count(*) as usage_records
from system.billing.usage u
join system.billing.list_prices p
    on u.cloud = p.cloud
    and u.sku_name = p.sku_name
    and u.usage_unit = p.usage_unit
    and u.usage_end_time >= p.price_start_time
    and (p.price_end_time is null or u.usage_end_time < p.price_end_time)
where u.billing_origin_product = 'AI_FUNCTIONS'
    and p.currency_code = 'USD'
    and u.usage_date >= current_date() - 2  -- look back 2 days, since records can take up to 12 hours to appear
group by 1
order by 3 desc;
```

Functions like `ai_classify` are recorded under `AI_FUNCTIONS`. Batch `ai_query` calls are recorded under `MODEL_SERVING` with `offering_type = 'BATCH_INFERENCE'`, so they don't show up in this query. [Databricks says](https://docs.databricks.com/aws/en/large-language-models/ai-functions) billing records are typically available within 12 hours, so run your 50-row test and check the next day.

</TabItem>

<TabItem value="bigquery" label="BigQuery">

BigQuery doesn't have a single view that reports AI function cost, so check usage in these places instead:

- **Before you run:** use `AI.COUNT_TOKENS` to estimate input tokens. It's free, and it doesn't count output tokens.
- **After your 50-row test run:** open the query in the Google Cloud console and check the **Job information** tab for input and output token counts.
- **Across your project:** BigQuery has daily token quotas for Gemini-based AI functions like `AI.CLASSIFY` (but not `AI.EMBED`). Check **AI input tokens per day** and **AI output tokens per day** under **IAM & Admin > Quotas & System Limits**, and set an alert. Refer to [Control costs with token quotas](https://docs.cloud.google.com/bigquery/docs/control-genai-costs).

For the cost in dollars, Google bills AI function token usage under Vertex AI. If your organization exports Cloud Billing data to BigQuery, this query lists today's costs by service and SKU. Look for the token-based Vertex AI line:

```sql
select
    service.description as service,
    sku.description as sku,
    round(sum(cost) + sum(ifnull((select sum(c.amount) from unnest(credits) c), 0)), 4) as cost_after_credits
from `<project>.<dataset>.gcp_billing_export_v1_<billing_account_id>`
where usage_start_time >= timestamp(date_sub(current_date(), interval 2 day))  -- look back 2 days, since billing data can take up to 24 hours to appear
group by 1, 2
order by 3 desc;
```

Billing data can take up to 24 hours to show up, and the export only has data from when it was switched on.

</TabItem>

</Tabs>

Then do the math before committing to a full dataset run:

```txt
(cost of the test run / rows tested) x total rows = estimated cost of the full run
```

Your warehouse might report usage in dollars, credits, or something else so make sure you convert it to dollars using what your account pays. So for example, if 50 rows cost $0.04, 60,000 rows will cost about $48. You can then decide if it's worth it.

:::tip
Add the estimated total cost to your PR description since it can help reviewers decide whether the change is worth merging or not
:::

## 3. Use incremental to avoid re-classifying existing rows

New reviews arrive all day, but yesterday's reviews are already tagged. Re-classifying them would be a waste (and might lead to inconsistent results), so the team wants to tag each review once and keep the answer. Make these models incremental so that processed rows are never touched again.

Here's the `reviews_classified` model configured as an incremental model with sampling outside of prod:

```sql
{{
    config(
        materialized = 'incremental',
        unique_key = 'review_id'
    )
}}

select
    review_id,
    review_text,
    ai_classify(
        review_text,
        ['delivery', 'order problems', 'price', 'gameplay', 'bugs']
    ) as classification,
    _fivetran_synced

from {{ ref('stg_reviews') }}

{% if is_incremental() %}
    where _fivetran_synced >= (select max(_fivetran_synced) from {{ this }})
{% endif %}

{% if env_var('DBT_CLOUD_ENVIRONMENT_TYPE', '') != 'prod' %}
    qualify row_number() over (order by random()) <= 50
{% endif %}
```

## 4. Prevent accidental full refreshes

A week later, the team refines the list of topics: adding new themes and removing others. The incremental model will use these new rules on future records, but they also want to re-process the existing reviews with the `--full-refresh` flag.

The risk is that the `--full-refresh` flag is a blunt instrument, regenerating all models in its path. To protect the `reviews_classified` model from being inadvertently rebuilt, the team adds an extra layer of protection with one line of config:

```sql
{{
    config(
        materialized = 'incremental',
        unique_key = 'review_id',
        full_refresh = var('refresh_review_tags', false)
    )
}}
```

This says: don't rebuild this incremental model, regardless of the `--full-refresh` flag. Think of it as a safety cover on a big red button – bumping the button does nothing. To rebuild on purpose, you lift the cover by removing the override:

```shell
dbt run -s reviews_classified --full-refresh --vars '{"refresh_review_tags": null}'
```

This table shows what happens in each scenario:

<SimpleTable>

| What you run | `is_incremental()` | What happens |
| --- | --- | --- |
| First `dbt run` | `false` | All reviews are classified |
| Subsequent `dbt run` | `true` | Only new reviews are classified |
| `dbt run --full-refresh` | `true` | Only new reviews are classified |
| `dbt run --full-refresh --vars '{"refresh_review_tags": null}'` | `false` | Table rebuilt, all reviews are classified |
| `dbt run --vars '{"refresh_review_tags": true}'` | `false` | Table rebuilt without `--full-refresh`, all reviews are classified. |

</SimpleTable>

:::caution Using the `full-refresh` config 
The [`full_refresh` config](/reference/resource-configs/full_refresh) has three states. When set to true, it will force a refresh whether or not the `--full-refresh` flag is present. Passing `--vars '{"refresh_review_tags": null}'` as a YAML dictionary is safer because it evaluates to `none` and requires the `--full-refresh` flag to also be present.
:::

## Summary

<SimpleTable>
| Rule | Why it matters | How to do it |
| --- | --- | --- |
| 1. Sample rows outside of prod | Reduces cost in lower environments | Filter on `env_var()` or `target.name` |
| 2. Check the price first | Avoids sticker shock after deployment | Your warehouse's usage view |
| 3. Use incremental models | Only process records once | Filter on modified date |
| 4. Prevent accidental full refreshes | `--full-refresh` applies to all selected nodes | Add `full_refresh` config based on a variable |
</SimpleTable>

## What's next

These guardrails are the highest-leverage protections for basic scenarios. There are other situations worth considering: a row's change might be metadata other than the review, and changing the AI model or prompt used will invalidate earlier. 

The [dbt-context-engineering](/blog/dbt-context-engineering) package includes macros to help with these more complex use cases, such as comparing a hash of each row's input and stamping each row with the model or prompt version. Check out those examples and share what worked (or didn't) in the [dbt Community Slack](https://www.getdbt.com/community).

The Jaffle Games Shop data team made it through launch week with every review tagged and the AI bill under control 👏. But there's more to do. The reviews are full of things nobody predicted, and maintaining the list of themes by hand is brittle. In part 2 of this series, we'll let an AI function suggest the topics itself and show how to reuse these guardrails so it can't run twice on the same review.

Launch week also brings a new mission: the support inbox is filling up and the team needs to know which tickets to answer first. That calls for a different kind of model, so in part 3 we'll sort the inbox with [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), a decision model, and the [`dbt-decisions`](https://github.com/dbt-labs/dbt-decisions) package.
