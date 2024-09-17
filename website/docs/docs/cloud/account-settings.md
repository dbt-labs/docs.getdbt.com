---
title: "Account settings in dbt Cloud"
description: "Learn how to enable account settings for your dbt Cloud users."
---

## Git repository caching <Lifecycle status="enterprise" />

At the start of every job run, dbt Cloud clones the project's Git repository so it has the latest versions of your project's code and runs `dbt deps` to install your dependencies. 

For improved reliability and performance on your job runs, you can enable dbt Cloud to keep a cache of the project's Git repository. So, if there's a third-party outage that causes the cloning operation to fail, dbt Cloud will instead use the cached copy of the repo so your jobs can continue running as scheduled. 

dbt Cloud caches your project's Git repo after each successful run and retains it for 8 days if there are no repo updates. It caches all packages regardless of installation method and does not fetch code outside of the job runs. 

dbt Cloud will use the cached copy of your project's Git repo under these circumstances:

- Outages from third-party services (for example, the [dbt package hub](https://hub.getdbt.com/)).
- Git authentication fails.
- There are syntax errors in the `packages.yml` file. You can set up and use [continuous integration (CI)](/docs/deploy/continuous-integration) to find these errors sooner.
- If a package doesn't work with the current dbt version. You can set up and use [continuous integration (CI)](/docs/deploy/continuous-integration) to identify this issue sooner.

To enable Git repository caching, select **Account settings** from the gear menu and enable the **Repository caching** option. 

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Repository caching option" />

## Partial parsing

At the start of every dbt invocation, dbt reads all the files in your project, extracts information, and constructs an internal manifest containing every object (model, source, macro, and so on). Among other things, it uses the `ref()`, `source()`, and `config()` macro calls within models to set properties, infer dependencies, and construct your project's DAG. When dbt finishes parsing your project, it stores the internal manifest in a file called `partial_parse.msgpack`. 

Parsing projects can be time-consuming, especially for large projects with hundreds of models and thousands of files. To reduce the time it takes dbt to parse your project, use the partial parsing feature in dbt Cloud for your environment. When enabled, dbt Cloud uses the `partial_parse.msgpack` file to determine which files have changed (if any) since the project was last parsed, and then it parses _only_ the changed files and the files related to those changes.

Partial parsing in dbt Cloud requires dbt version 1.4 or newer. The feature does have some known limitations. Refer to [Known limitations](/reference/parsing#known-limitations) to learn more about them.

To enable, select **Account settings** from the gear menu and enable the **Partial parsing** option.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Partial parsing option" />

## Account access to Advanced CI features <Lifecycle status="beta" />

[Advanced CI](/docs/deploy/advanced-ci) features, such as [compare changes](/docs/deploy/advanced-ci#compare-changes), allow dbt Cloud account members to view details about the changes between what's in the production environment and the pull request.

To use Advanced CI features, your dbt Cloud account must have access to them. Ask your dbt Cloud administrator to enable Advanced CI features on your account, which they can do by selecting **Account settings** from the gear menu and choosing the **Enable account access to Advanced CI** option.

Once enabled, the **Run compare changes** option becomes available in the CI job settings for you to select.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Advanced CI option in Account settings" />