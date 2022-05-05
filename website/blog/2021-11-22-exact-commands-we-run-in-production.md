---
title: "The Exact dbt Commands We Run in Production"
description: "Without a command to run them, dbt models and tests are just taking up space in a Git repo. These are the exact dbt commands we run internally at dbt Labs."
slug: dbt-production-commands

authors: [andrew_escay]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2021-11-29
is_featured: false
---

Without a command to run them, dbt models and tests are just taking up space in a Git repo.

The specific dbt commands you run in production are the control center for your project. They are the structure that defines your team’s data quality + freshness standards.

<!--truncate-->

> _Note: As of dbt v0.21.0 (released in October 2021), you can now set your preferred production commands using [`dbt build`](https://github.com/dbt-labs/dbt-core/releases). Once setup, a single `dbt build` command can be used to execute your prescribed `seed`, `test`, `run` and `snapshot` and other commands in a specified order._

The most important command is [`dbt run`](https://docs.getdbt.com/reference/commands/run). But in deployment, we rarely just use `dbt run`.

You’re probably familiar with a bunch of [dbt commands](https://docs.getdbt.com/reference/dbt-commands) already, and this section is dedicated to showing you what we believe the most effective commands should be when running your dbt project in production!

In production, reliability and consistency are key. This guarantees that your stakeholders have data that could be meaningfully used. In order to ensure reliability and consistency, here are a few principles we believe you should keep in mind when designing your deployment commands:

## Principles of dbt deployment commands

<WistiaVideo id="7em2tj62yo" />

### 1) Always test your data

You’re likely already familiar with testing in dbt, and we believe that every production run should always be tested.


### 2) Understand the impact of delayed data in your project

Some projects can afford to have older data in the warehouse, others can’t.


### 3) Simplify your regularly scheduled runs

The more complex your run commands are, the harder it gets to maintain this in the long run. Feel free to rely on dbt’s DAG (more info on why we <3 DAGs in my colleagues Christine + Randy’s [modular data modeling technique](https://getdbt.com/analytics-engineering/modular-data-modeling-technique/) post).

Given those principles, we’ll now take a look at the most common run commands for production jobs, and why we think they could work for your organization! Do note that yours may vary slightly (depending on your team’s specific needs), but as long as you stick to the principles mentioned above, your project should be in good shape!


## Simplest possible production dbt commands

The simplest version of your project’s scheduled run commands could be:

```

dbt run

dbt test

```

This version is the most basic and adheres to all the principles mentioned above. This assumes that you can afford to have slightly incorrect data (data is only tested after a dbt project runs).


## Preferred production dbt commands

In practice however, we often find that this is more effective:

```

dbt test -s source:* (or dbt test -m source:* if you are on a version earlier than dbt v0.21.0)

dbt run

dbt test --exclude source:*

dbt source `freshness ` (or dbt source snapshot-freshness if you are on a version earlier to dbt v0.21.0) (this could optionally be the first step)

```

This is a more robust implementation of the first version. The two additions here would be:



1. Testing source data before running any dbt transformation, and
2. Testing source freshness

When you test source data before running transformations, this removes the possibility of bad source data affecting the dbt project.

This will stop the build process if bad source data is detected, and protects the integrity of your dbt models.

When sources are tested for freshness, it allows you to easily triage whether data in your warehouse is old, and subsequently alert relevant stakeholders.

You could also opt to run your source freshness test at the beginning, if your organization would prefer that stale data isn’t processed, or if you believe that stale data could lead to unreliable final models.


## Pro trip: beware of model selectors

First, I want to quickly cover the topic of using [model selectors](https://docs.getdbt.com/reference/node-selection/syntax) (`-s` for specific models/tags/folders, or `-m` if you’re on a version prior to dbt v0.21.0) in your run commands. You may already know how to run specific models and subsequently their parent or child models.

When building production jobs, we highly advise not relying on these, as it adds to the complexity of your project, and is prone to creating mismatched timings in your build steps.

The way to think about model selectors in runs is more of an exception, rather than the default. It’s best to start with a single main job that runs at a consistent cadence. From there, assess whether specific parts of your dbt project need specific handling for optimization.

Maybe some models only require updating once a week, while everything else needs to be updated every hour. Maybe some teams need data at a specific time of the day, and thus need their models to be run at a specific time in the morning.

These exceptions justify having separate run commands, and even a separate job, but make sure to exercise caution when building these as they could easily become difficult to manage in the long run.


## How do your run commands differ?

These are the dbt commands that our team runs in production, and we recommend to our professional services clients.

But! Your mileage will vary, and there are perfectly good reasons for running other commands in production—I’m always curious to see what works best for your team.

As long as you remember the core principles I shared earlier (mostly keep things simple), you’ll be in great shape.
