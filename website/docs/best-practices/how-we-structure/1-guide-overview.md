---
title: "How we structure our dbt projects"
id: 1-guide-overview
description: Learn how we structure our dbt projects.
displayText: How we structure our dbt projects
hoverSnippet: Learn how we structure our dbt projects.
---

## Why does structure matter?

Analytics engineering, at its core, is about helping groups of human beings collaborate on better decisions at scale. We have [limited bandwidth for making decisions](https://en.wikipedia.org/wiki/Decision_fatigue). We also, as a cooperative social species, rely on [systems and patterns to optimize collaboration](https://en.wikipedia.org/wiki/Pattern_language) with others. This combination of traits means that for collaborative projects it's crucial to establish consistent and comprehensible norms such that your team’s limited bandwidth for decision making can be spent on unique and difficult problems, not deciding where folders should go or how to name files.

Building a great dbt project is an inherently collaborative endeavor, bringing together domain knowledge from every department to map the goals and narratives of the entire company. As such, it's especially important to establish a deep and broad set of patterns to ensure as many people as possible are empowered to leverage their particular expertise in a positive way, and to ensure that the project remains approachable and maintainable as your organization scales.

Famously, Steve Jobs [wore the same outfit everyday](https://images.squarespace-cdn.com/content/v1/5453c539e4b02ab5398ffc8f/1580381503218-E56FQDNFL1P4OBLQWHWW/ke17ZwdGBToddI8pDm48kJKedFpub2aPqa33K4gNUDwUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcxb5ZTIyC_D49_DDQq2Sj8YVGtM7O1i4h5tvKa2lazN4nGUQWMS_WcPM-ztWbVr-c/steve_jobs_outfit.jpg) to reduce decision fatigue. You can think of this guide similarly, as a black turtleneck and New Balance sneakers for your company’s dbt project. A dbt project’s power outfit, or more accurately its structure, is composed not of fabric but of files, folders, naming conventions, and programming patterns. How you label things, group them, split them up, or bring them together — the system you use to organize the [data transformations](https://www.getdbt.com/analytics-engineering/transformation/) encoded in your dbt project — this is your project’s structure.

This guide is just a starting point. You may decide that you prefer Birkenstocks or a purple hoodie for your project over Jobs-ian minimalism. That's fine. What's important is that you think through the reasoning for those changes in your organization, explicitly declare them in a thorough, accessible way for all contributors, and above all _stay consistent_.

One foundational principle that applies to all dbt projects though, is the need to establish a cohesive arc moving data from _source-conformed_ to _business-conformed_. Source-conformed data is shaped by external systems out of our control, while business-conformed data is shaped by the needs, concepts, and definitions we create. No matter what patterns or conventions you define within your project, this process remains the essential purpose of the transformation layer, and dbt as your tool within it. This guide is an update to a seminal analytics engineering [post of the same name](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355) by the great Claire Carroll, and while some of the details have changed over time (as anticipated in that post) this fundamental trajectory holds true. Moving forward, this guide will be iteratively updated as new tools expand our viewpoints, new experiences sharpen our vision, and new voices strengthen our perspectives, but always in service of that aim.

### Learning goals

This guide has three main goals:

- Thoroughly cover our most up-to-date recommendations on how to structure typical dbt projects
- Illustrate these recommendations with comprehensive examples
- At each stage, explain _why_ we recommend the approach that we do, so that you're equipped to decide when and where to deviate from these recommendations to better fit your organization’s unique needs

You should walk away from this guide with a deeper mental model of how the components of a dbt project fit together, such that purpose and principles of analytics engineering feel more clear and intuitive.

By approaching our structure intentionally, we’ll gain a better understanding of foundational ideals like moving our data from the wide array of narrower source-conformed models that our systems give us to a narrower set of wider, richer business-conformed designs we create. As we move along that arc, we’ll understand how stacking our transformations in optimized, modular layers means we can apply each transformation in only one place. With a disciplined approach to the files, folders, and materializations that comprise our structure, we’ll find that we can create clear stories not only through our data, but also our codebase and the artifacts it generates in our warehouse.

Our hope is that by deepening your sense of the connections between these patterns and the principles they flow from, you'll be able to translate them to fit your specific needs and craft customized documentation for your team to act on.

:::info Example project.
This guide walks through our recommendations using a very simple dbt project — similar to the one used for the Getting Started guide and many other demos — from a fictional company called the Jaffle Shop. You can read more about [jaffles](https://en.wiktionary.org/wiki/jaffle) if you want (they _are_ a real thing), but that context isn’t important to understand the structure. We encourage you to follow along, try things out, make changes, and take notes on what works or doesn't work for you along the way.
:::

We'll get a deeper sense of our project as we move through the guide, but for now we just need to know that the Jaffle Shop is a restaurant selling jaffles that has two main data sources:

- A replica of our transactional database, called `jaffle_shop`, with core entities like orders and customers.
- Synced data from [Stripe](https://stripe.com/), which we use for processing payments.

### Guide structure overview

We'll walk through our topics in the same order that our data would move through transformation:

1. Dig into how we structure the files, folders, and models for our three primary layers in the `models` directory, which build on each other:
   1. **Staging** — creating our atoms, our initial modular building blocks, from source data
   2. **Intermediate** — stacking layers of logic with clear and specific purposes to prepare our staging models to join into the entities we want
   3. **Marts** — bringing together our modular pieces into a wide, rich vision of the entities our organization cares about
2. Explore how these layers fit into the rest of the project:
   1. Review the overall structure comprehensively
   2. Expand on YAML configuration in-depth
   3. Discuss how to use the other folders in a dbt project: `tests`, `seeds`, and `analyses`

Below is the complete file tree of the project we’ll be working through. Don’t worry if this looks like a lot of information to take in at once - this is just to give you the full vision of what we’re building towards. We’ll focus in on each of the sections one by one as we break down the project’s structure.

```shell
jaffle_shop
├── README.md
├── analyses
├── seeds
│   └── employees.csv
├── dbt_project.yml
├── macros
│   └── cents_to_dollars.sql
├── models
│   ├── intermediate
│   │   └── finance
│   │       ├── _int_finance__models.yml
│   │       └── int_payments_pivoted_to_orders.sql
│   ├── marts
│   │   ├── finance
│   │   │   ├── _finance__models.yml
│   │   │   ├── orders.sql
│   │   │   └── payments.sql
│   │   └── marketing
│   │       ├── _marketing__models.yml
│   │       └── customers.sql
│   ├── staging
│   │   ├── jaffle_shop
│   │   │   ├── _jaffle_shop__docs.md
│   │   │   ├── _jaffle_shop__models.yml
│   │   │   ├── _jaffle_shop__sources.yml
│   │   │   ├── base
│   │   │   │   ├── base_jaffle_shop__customers.sql
│   │   │   │   └── base_jaffle_shop__deleted_customers.sql
│   │   │   ├── stg_jaffle_shop__customers.sql
│   │   │   └── stg_jaffle_shop__orders.sql
│   │   └── stripe
│   │       ├── _stripe__models.yml
│   │       ├── _stripe__sources.yml
│   │       └── stg_stripe__payments.sql
│   └── utilities
│       └── all_dates.sql
├── packages.yml
├── snapshots
└── tests
    └── assert_positive_value_for_total_amount.sql
```
