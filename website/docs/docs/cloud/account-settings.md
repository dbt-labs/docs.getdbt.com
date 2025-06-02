---
title: "Account settings in dbt"
sidebar_label: "Account settings" 
description: "Learn how to enable account settings for your dbt users."
---

The following sections describe the different **Account settings** available from your <Constant name="cloud" /> account in the sidebar (under your account name on the lower left-hand side). 

<Lightbox src="/img/docs/dbt-cloud/example-sidebar-account-settings.png" title="Example of Account settings from the sidebar" /> 

## Git repository caching <Lifecycle status="managed,managed_plus" />

:::important repo caching enabled by default

<Constant name="git" /> repository caching is enabled by default for all new Enterprise and Enterprise+ accounts, improving reliability by allowing <Constant name="cloud" /> to use a cached copy of your repo if cloning fails. 

See the next section for more details on repo caching, retention, and more.
:::

At the start of every [job](/docs/deploy/jobs) run, <Constant name="cloud" /> clones the project's Git repository so it has the latest versions of your project's code and runs `dbt deps` to install your dependencies. 

For improved reliability and performance on your job runs, you can enable <Constant name="cloud" /> to keep a cache of the project's <Constant name="git" /> repository. So, if there's a third-party outage that causes the cloning operation to fail, <Constant name="cloud" /> will instead use the cached copy of the repo so your jobs can continue running as scheduled. 

<Constant name="cloud" /> caches your project's <Constant name="git" /> repo after each successful run and retains it for 8 days if there are no repo updates. It caches all packages regardless of installation method and does not fetch code outside of the job runs. 

<Constant name="cloud" /> will use the cached copy of your project's <Constant name="git" /> repo under these circumstances:

- Outages from third-party services (for example, the [dbt package hub](https://hub.getdbt.com/)).
- <Constant name="git" /> authentication fails.
- There are syntax errors in the `packages.yml` file. You can set up and use [continuous integration (CI)](/docs/deploy/continuous-integration) to find these errors sooner.
- If a package doesn't work with the current dbt version. You can set up and use [continuous integration (CI)](/docs/deploy/continuous-integration) to identify this issue sooner.
- Note, <Constant name="git" /> repository caching should not be used for CI jobs. CI jobs are designed to test the latest code changes in a pull request and ensure your code is up to date. Using a cached copy of the repo in CI jobs could result in stale code being tested.

To use, select the **Enable repository caching** option from your account settings. 

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Enable repository caching option" />

## Partial parsing

At the start of every dbt invocation, dbt reads all the files in your project, extracts information, and constructs an internal manifest containing every object (model, source, macro, and so on). Among other things, it uses the `ref()`, `source()`, and `config()` macro calls within models to set properties, infer dependencies, and construct your project's DAG. When dbt finishes parsing your project, it stores the internal manifest in a file called `partial_parse.msgpack`. 

Parsing projects can be time-consuming, especially for large projects with hundreds of models and thousands of files. To reduce the time it takes dbt to parse your project, use the partial parsing feature in <Constant name="cloud" /> for your environment. When enabled, <Constant name="cloud" /> uses the `partial_parse.msgpack` file to determine which files have changed (if any) since the project was last parsed, and then it parses _only_ the changed files and the files related to those changes.

Partial parsing in <Constant name="cloud" /> requires dbt version 1.4 or newer. The feature does have some known limitations. Refer to [Known limitations](/reference/parsing#known-limitations) to learn more about them.

To use, select the **Enable partial parsing between deployment runs** option from your account settings.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Enable partial parsing between deployment runs option" />

## Account access to Advanced CI features <Lifecycle status="managed,managed_plus" />

[Advanced CI](/docs/deploy/advanced-ci) features, such as [compare changes](/docs/deploy/advanced-ci#compare-changes), allow <Constant name="cloud" /> account members to view details about the changes between what's in the production environment and the pull request.

To use Advanced CI features, your <Constant name="cloud" /> account must have access to them. Ask your <Constant name="cloud" /> administrator to enable Advanced CI features on your account, which they can do by choosing the **Enable account access to Advanced CI** option from the account settings.

Once enabled, the **dbt compare** option becomes available in the CI job settings for you to select.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Enable account access to Advanced CI option" />
