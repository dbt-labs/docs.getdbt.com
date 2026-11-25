---
title: "How to cost-effectively use warehouse AI functions in your dbt project"
description: "AI functions in SQL are easy to write and equally easy to overspend on. Here are four strategies to keep the bill under control."
slug: ai-function-guardrails
image: /img/blog/2026-11-26-ai-function-guardrails/jaffle-shop-games-storefront.webp

authors: [benoit_perigaud, doug_beatty, mirna_wong]

tags: [ai]
hide_table_of_contents: false

date: 2026-11-26
is_featured: false
---


Let's take GTA VI launch time at Jaffle Shop Games, an online game store. Orders are flying and customer reviews are pouring in, and it's getting hard to keep up!

Someone on the Jaffle Shop Games data team has a good idea: categorize reviews into common themes,  so the team can see what customers are talking about. So they add an `AI_CLASSIFY()` function to the reviews model, run it once to check it works, and then head out to play GTA over lunch.

Warehouse-provided SQL functions are easy to write – they feel just like normal SQL! But their cost structure makes it easy to overspend, especially if you re-process every record in dev, then CI, then every day once it reaches production.

This post covers four patterns for cost-effectively using AI functions on your data, powered by standard dbt features: sampling in dev and CI, estimating total cost before deploying, building incrementally, and protecting against full refreshes.

<Lightbox src="/img/blog/2026-11-26-ai-function-guardrails/jaffle-shop-games-storefront.webp" width="85%" title="The Jaffle Shop Games storefront on a nice, sunny day!" />

<!-- truncate -->

## Why AI functions get expensive

Think of an AI function as an arcade machine that answers questions. Every question costs a coin, and a dbt model asks one question per row.

AI functions (like Cortex's `AI_COMPLETE` and `AI_CLASSIFY`) are usually billed by the token, which is roughly the amount of text you send and get back. A table with tens of thousands of customer reviews adds up fast: a single run can cost hundreds of dollars. Dev runs, CI jobs, and full refreshes each pay that again.

At Jaffle Shop Games, customers write reviews in the store's review tool. Fivetran ingests them into the warehouse, where they land as raw data. From there, dbt takes over:

1. A staging model, `stg_reviews`, tidies them up.
2. A second model, `reviews_classified`, calls an AI function once for each review. You give the function a review and a list of topics, and it answers with the topic that fits best. For example, "My download code never arrived!" comes back as "order problems".
dbt then saves those answers in a table, so every review ends up with its topic next to it. That also means every call costs money.

<Lightbox src="/img/blog/2026-11-26-ai-function-guardrails/reviews-flow.webp" width="100%" title="Reviews flow from the store's review tool into your warehouse, through stg_reviews and reviews_classified, and end up as a table with a topic next to each review" />

The examples in this post use Snowflake Cortex functions, but the underlying dbt patterns are consistent regardless of the platform you're using.


## 1. Sample a handful of rows

During development and CI, it's unnecessary to classify every single record on every single `dbt run`, when you just need to check that the system is working as expected. The data team at Jaffle Shop Games changed their `reviews_classified` model to only classify 50 random reviews outside of production environments. Here's how it looks now:

```sql
select
    review_id,
    review_text,
    ai_classify(
        review_text,
        ['delivery', 'download codes', 'price', 'gameplay', 'bugs']
    ) as classification_raw

from {{ ref('stg_reviews') }}

-- this is the guardrail: outside production, keep only 50 random reviews
{% if env_var('DBT_CLOUD_ENVIRONMENT_TYPE', '') != 'prod' %}
    qualify row_number() over (order by random()) <= 50
{% endif %}
```

dbt platform [automatically sets](/docs/build/environment-variables#special-environment-variables) `DBT_CLOUD_ENVIRONMENT_TYPE`. You can choose a different environment variable or filter on `target.name` – anything that differentiates one environment from another is fine. Specifying a default value `''` prevents the dbt invocation from failing if it's not set.


## 2. Check the price on a small sample first

Before the first production run, the team wants to know what tagging the full reviews table will cost. Pattern 1 already gives them a 50-row sample run, so they use it to check what it spent.

The following tabs some sql query examples using AI functions for some of the common warehouses used today. Make sure to double check the query and your warehouse's syntax:

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

{/* TODO: untested on a Databricks workspace. Confirm before publishing. */}

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
    and u.usage_date >= current_date()  -- filter to today
group by 1
order by 3 desc;
```

Functions like `ai_classify` are recorded under `AI_FUNCTIONS`. Batch `ai_query` calls are recorded under `MODEL_SERVING` with `offering_type = 'BATCH_INFERENCE'`, so they don't show up in this query. [Databricks says](https://docs.databricks.com/aws/en/large-language-models/ai-functions) billing records are typically available within 12 hours, so run your 50-row test and check the next day.

</TabItem>

<TabItem value="bigquery" label="BigQuery">

{/* TODO: the billing export query is untested on a BigQuery project. Confirm before publishing. */}

BigQuery doesn't have a single view that reports AI function cost, so check usage in these places instead:

- **Before you run:** use the `AI.COUNT_TOKENS` function to estimate how many input tokens a query will use.
- **After your 50-row test run:** open the query in the Google Cloud console and check the **Job information** tab, which shows the tokens the query used.
- **Across your project:** BigQuery has daily token quotas for AI functions (AI input tokens per day and AI output tokens per day). Check them under **IAM & Admin > Quotas & System Limits**, and set an alert. Refer to [Control costs with token quotas](https://docs.cloud.google.com/bigquery/docs/control-genai-costs).

If your organization exports Cloud Billing data to BigQuery, you can also look for the cost there. Google says AI function token usage correlates with your Vertex AI billing, but we couldn't confirm which service BigQuery AI functions are billed under. So this query lists today's costs by service and SKU, and you can look for the token-based line:

```sql
select
    service.description as service,
    sku.description as sku,
    round(sum(cost) + sum(ifnull((select sum(c.amount) from unnest(credits) c), 0)), 4) as cost_after_credits
from `<project>.<dataset>.gcp_billing_export_v1_<billing_account_id>`
where usage_start_time >= timestamp(current_date())
group by 1, 2
order by 3 desc;
```

The export only contains data from when it was switched on.

</TabItem>

<TabItem value="redshift" label="Redshift">

Redshift AI functions call Amazon Bedrock, and Bedrock bills for the usage, so check your Amazon Bedrock usage and billing reports. In AWS Cost and Usage Reports and Data Exports, Bedrock usage appears under a usage type that names the model and token type, for example `USE1-Claude4.6Sonnet-cache-read-input-token-count`. Refer to [Understanding your Amazon Bedrock Cost and Usage Report data](https://docs.aws.amazon.com/bedrock/latest/userguide/cost-mgmt-understanding-cur-data.html).

We haven't confirmed whether Redshift calls can be told apart from other Bedrock usage in the same account. Refer to [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/) and [Costs for using Amazon Redshift ML](https://docs.aws.amazon.com/redshift/latest/dg/cost.html).

</TabItem>

</Tabs>

Then do the math before committing to a full dataset run:

```txt
(credits used / rows tested) x total rows = units of cost/credits for the full run
```

For example, if 50 rows used 0.02 credits, 60,000 rows will use about 24 credits. Multiply by what your account pays per credit and decide if it's worth it.

## 3. Use incremental to avoid re-classifying existing rows

New reviews arrive all day, but yesterday's reviews are already tagged. Tagging a review costs the same today as it did yesterday, so the team wants to tag each review once and keep the answer. For models that call `AI_CLASSIFY` on every row, make them incremental so already-classified rows are never touched again.

Here's the `reviews_classified` model as an incremental model, with pattern 1 included:

```sql
{{
    config(
        materialized = 'incremental',
        unique_key = 'review_id'
    )
}}

select
    review_id,
    ai_classify(
        review_text,
        ['delivery', 'download codes', 'price', 'gameplay', 'bugs']
    ) as classification_raw

from {{ ref('stg_reviews') }}

{% if is_incremental() %}
    where review_id not in (select review_id from {{ this }})
{% endif %}

{% if env_var('DBT_CLOUD_ENVIRONMENT_TYPE', '') != 'prod' %}
    qualify row_number() over (order by random()) <= 50
{% endif %}
```

Each Fivetran sync brings in new reviews, and the model runs the AI function only on those. On GTA VI launch week, that's the difference between paying for 500 new reviews an hour and paying for every review since midnight, every hour. Without the incremental guard, every `dbt run` re-classifies the entire history.

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


| What you run | `is_incremental()` | What happens |
| --- | --- | --- |
| First ever run (no table yet) | `false` | The `AI_CLASSIFY` call runs on the reviews (a sample of 50 outside production) |
| A normal `dbt run` | `true` | Only new reviews are tagged |
| `dbt run-operation generate_new_source_rows --args '{count: 20}'` | n/a (not a model run) | 20 new reviews land in the raw reviews table, like a Fivetran sync would bring them. Nothing is tagged yet: the next `dbt run` tags only those 20 |
| `dbt run --full-refresh` | `true` (table not dropped) | The table isn't rebuilt. Existing tags are kept |
| `dbt run --full-refresh --vars '{"refresh_review_tags": true}'` | `false` (table dropped and rebuilt) | The table is rebuilt and every review is tagged again |
| `dbt run --vars '{"refresh_review_tags": true}'` (no `--full-refresh`) | `false` (table dropped and rebuilt) | The table is rebuilt and every review is tagged again, even without `--full-refresh` |

{/* TODO: the run-operation row is still untested. Confirm before publishing. */}

To re-tag everything on purpose, set the variable to `true` and keep `--full-refresh` in the command too, so it reads as the rebuild it is:

```shell
dbt run \
  -s reviews_classified \
  --full-refresh \
  --vars '{"refresh_review_tags": true}'
```

Running `--full-refresh` on its own doesn't rebuild the table: dbt doesn't drop it, so no `AI_CLASSIFY` calls are made on old reviews. Rebuilding takes a deliberate, typed-out decision, which is _exactly_ how spending money should work.

:::caution
The [`full_refresh` config](/reference/resource-configs/full_refresh) has three states. When set to true, it will force a refresh whether or not the `--full-refresh` flag is present. Passing `--vars '{"refresh_review_tags": null}'` as a YAML dictionary is safer because it evaluates to `none` and requires the `--full-refresh` flag to also be present.
:::

## The four patterns at a glance

| Rule | What it stops | dbt feature |
| --- | --- | --- |
| 1. Sample a handful of rows | Dev and CI runs paying for the full table | `env_var()` with a safe default |
| 2. Check the price first | Finding out the cost after you've spent it | Your warehouse's usage view |
| 3. Never pay twice | Re-tagging rows you already tagged | Incremental models |
| 4. Prevent accidental full refreshes | Accidental full rebuilds that re-tag every row | `full_refresh` config set by a variable |

<Lightbox src="/img/blog/2026-11-26-ai-function-guardrails/four-guardrail-patterns.png" width="100%" title="The four guardrails in order: sample a handful of rows, prevent accidental full refreshes, never pay twice, and check the price first" />

{/* TODO: this diagram still shows the old order. Regenerate as sample, check the price, never pay twice, prevent accidental full refreshes, then update the title. */}

## What's next

Remember the arcade machine from earlier, where every question costs a coin and dbt asks one question per review? It now has a sign taped to it: "One coin per review. Please don't feed me twice." The four guardrails are the tape. Sampling keeps the number of coins down, the price check tells you how many coins a full run will take, and incremental models and protection from accidental full refreshes stop the same review being asked twice.

The sign covers the basics, and more scenarios need more. Rows can change after they've been processed, and changing your model or prompt makes earlier results out of date. [dbt-context-engineering](https://github.com/dbt-labs/dbt-context-engineering) has patterns for both, such as comparing a hash of each row's input and stamping each row with the model or prompt version. Check out those examples and share what worked (or didn't) in the dbt Community Slack.

So the Jaffle Shop Games data team made it through the first rush of GTA VI launch week, with every review tagged and the AI function bill under control 👏. But launch week isn't over. The review topic list was written by hand, and launch-day reviews are full of things nobody predicted.

<Lightbox src="/img/blog/2026-11-26-ai-function-guardrails/chuck-norris-meme.png" width="80%" title="Launch-day reviews were full of things nobody predicted" />

In part 2 of this series, we'll let an AI function suggest the topics itself and show how to reuse these guardrails so it can't run twice on the same review.

Launch week also brings a new mission: the support inbox is filling up and the team needs to know which tickets to answer first. That calls for a different kind of model, so in part 3 we'll sort the inbox with [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), a decision model, and the [`dbt-decisions`](https://github.com/dbt-labs/dbt-decisions) package.
