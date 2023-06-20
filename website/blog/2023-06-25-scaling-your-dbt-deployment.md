---
title: "Scaling your dbt deployment: tips for governing dbt models"
description: "Pro tips for model contracts, model access modifiers, and model versioning."
slug: scaling-dbt-deployments

authors: [doug_beatty]

tags: [dbt product updates]
hide_table_of_contents: false

date: 2023-06-25
is_featured: true
---

# Scaling your dbt deployment: tips for governing dbt models

## Intro

Being an analytics hero is not easy work, and your wild successes will come with their own unique challenges. The more models you have, the harder it is to collaborate or find one model among many. The more consumers, the easier it is to cause data downtime for one of them when making changes. To avoid being the anti-hero, you need to keep development speedy while reducing risk of breaking things for downstream collaborators.

To empower you with more tools to govern your data products, and to lay the groundwork for multi-project collaboration, we just introduced three powerful new features in dbt Core 1.5: model contracts, model access modifiers, and model versioning.

<!--truncate-->

Our [docs on model governance](https://docs.getdbt.com/docs/collaborate/govern/about-model-governance) are the best source of detailed information about each of these features.

The new features allow you to more easily treat dbt models as data products that have clear interfaces, indicators of who should be able to access them, and provide migration pathways when change is necessary.

In the rest of this article, I will share a few high-yield key insights and pro-tips for each of these features. There’s also an associated demo repo in GitHub that serves as a lightweight way for you to try them all out.

## Model contracts

- With model contracts, the model won't even build if it doesn't meet the contracted requirements
- Model contracts allow you to specify a list of constraints, but `not_null` is the only one that is widely supported across data platforms – your mileage will vary with other types of constraints. Below is a summary of constraints supported by data platform as things currently stand.

| constraint type | dbt-postgres | dbt-redshift | dbt-snowflake | dbt-bigquery | dbt-spark / dbt-databricks |
|-----------------|:------------:|:------------:|:-------------:|:------------:|:--------------------------:|
|     not_null    |       🌕      |       🌕      |       🌕       |       🌕      |              🌗             |
|   primary_key   |       🌕      |       🌗      |       🌗       |       🌗      |              🌗             |
|   foreign_key   |       🌕      |       🌗      |       🌗       |       🌗      |              🌗             |
|      unique     |       🌕      |       🌗      |       🌗       |       🌑      |              🌗             |
|      check      |       🌕      |       🌑      |       🌑       |       🌑      |              🌗             |

### Legend

Some platforms allow a particular constaint for metadata purposes but not actually enforce it. This is common for modern cloud data warehouses and less common for legacy databases. These constraints are described as "supported but not enforced".

| Level of support                    | Description                                                                                                                                                                                                                                                        |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🌕 supported & enforced    | The model won't even build if it violates this constraint                                                                                                                                                                                                          |
| 🌗 supported; not enforced | The platform supports specifying this type of constraint, but a model can still build even if it violates it. |
| 🌑 not supported           | You can't specify this type of constraint for this platform                                                                                                                     


## Model access & groups

- Public access doesn’t have any effect in dbt 1.5 – this is coming in 1.6 when you’ll be able to access models across project boundaries
- Private access is great for models that are implementation details you may want to change without any notice
- Remember: groups are really for identifying teams of people who know how to use these private models for a particular purpose
- It makes sense for public models to be contracted and versioned
- For private and protected models, we would not expect you to need contracts or versions

## Model versioning

- Think of your dbt models as having two important interfaces (APIs):
    1. **inside** dbt - the dbt model itself (that can be ref'erenced)
    2. **outside** dbt - the database table/view names that external consumers can see and use
- Put legacy versions on a deprecation schedule and actually follow-through to avoid tech debt!
- Make use of pre-release versions to start sharing with your consumers ahead of time. e.g., identify unexpected "regressions" early, check out implications for downstream reporting, do some A/B testing on a new bit of business logic, etc.
- You only need to create a new version where there are breaking changes for your consumers -- you don't need to create a new version upon every change. It's your judgement call if a change is breaking or not.

### Unversioned relation name

This is the relation name before you have added versions to this model:

| Unversioned relation name |
|---------------------------|
| dim_customers             |


### Versioned relation name

This is your NEW relation name when you convert it to a versioned model:

| Versioned relation name   |
|---------------------------|
| dim_customers_v1          |

### Versioned relation names

These are your relation names when you have three different versions:

| Versioned relation names |
|--------------------------|
| dim_customers_v3         |
| dim_customers_v2         |
| dim_customers_v1         |

### Retaining an unversioned table name

When you first make the leap from an unversioned model to a versioned one, the names of all the database objects will begin having a suffix – the unversioned table names won’t be built anymore, and if you don’t delete those objects, then their data will be stale. When you have many consumers (like BI dashboards, etc) that are referring to an unversioned table name, you may want to create a pointer view to avoid needing to update all those references.

You have three options for table names:
1. No table names without a `_v` suffix (default)
2. Implement the unversioned database name as a pointer view to your latest version
3. Treat the unversioned database name as your 0th version

We’re guessing many of you may opt for number two -- see the discussion [here](https://github.com/dbt-labs/dbt-core/issues/7442) for three different ways to implement it.

It’s 100% up to you if you want to do options 2 or 3 (and how you want to do it) – we’ll be interested to hear what you prefer and how you accomplish it!

Depending on your feedback, we may build the most popular approach into a future version of dbt Core. We’d love to have your participation in [this GitHub Discussion](https://github.com/dbt-labs/dbt-core/issues/7442).


### Option 2

An additional view always points to the latest version.

| Automatically created by dbt | Option 2        |
|------------------------------|-----------------|
| dim_customers_v3             | ← dim_customers |
| dim_customers_v2             |                 |
| dim_customers_v1             |                 |

### Option 3

An additional view permenently points to the first version you created.

| Automatically created by dbt | Option 3        |
|------------------------------|-----------------|
| dim_customers_v3             |                 |
| dim_customers_v2             |                 |
| dim_customers_v1             | ← dim_customers |

## Repos for multiple projects

Looking ahead to when we support cross-project ref in v1.6, these features should work equally well whether you choose monorepos or many repos. In fact, building towards enabling multi-project interactions was a prime motivation for these features!

Once cross-project references are available, you'll be fully empowered to choose the number of repos that fits the scale of your organization:

| support | multiple vs. monorepos | dbt projects per repo          |
|---------|------------------------|--------------------------------|
|    ✅    | monorepo               | one dbt project per repo       |
|    ✅    | monorepo               | multiple dbt projects per repo |
|    ✅    | multiple repos         | one dbt project per repo       |
|    ✅    | multiple repos         | multiple dbt projects per repo |

## Summary

In summary, you can use model contracts to define guarantees of the data shape, model groups to identify the team that owns a model, model access to separate between public, protected, and private interfaces, and model versions to make breaking changes without data downtime.

At the end of the day, you have the choice to mix-n-match these features and use all, some, or none!

One of our company values is that “[We are humble](https://github.com/dbt-labs/corp/blob/725b6e9cf2af208d24a52fc04095c2feaff20b9d/values.md#we-are-humble)”, and we’re eager to hear your feedback, especially anything constructive! The [#dbt-core-multi-project](https://getdbt.slack.com/archives/C04FP5LQA15) channel in Slack is a great place for feedback.
