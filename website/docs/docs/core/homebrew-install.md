---
title: "Install with Homebrew"
description: "You can use Homebrew to install dbt Core and adapter plugins from the command line."
---

:::caution

Starting with v1.6, dbt Labs will no longer maintain Homebrew formulae as a supported installation method for dbt-core and adapters. For more on our rationale, consult this discussion:
- [Installing dbt Core: saying goodbye to brew and hello to "bundles"](https://github.com/dbt-labs/dbt-core/discussions/8277)

:::

dbt Labs maintains Homebrew formulae for the four oldest and most popular adapter plugins: Postgres, Redshift, Snowflake, and BigQuery.

We recommend you use Homebrew if you meet these conditions:

- You use MacOS for local development
- You use dbt with one of the four databases listed above
- You're not sure if you have system requirements (such as Python 3) already installed, and don't care to manage them by hand

If that sounds like you, great! Homebrew makes it significantly easier to install dbt Core. Note that:

- Installation with Homebrew can take longer than installing with other methods, because `brew` takes care of more setup behind the scenes
- If you're using an M1 Mac, we recommend that you install dbt via Homebrew with [Rosetta](https://support.apple.com/en-us/HT211861). This is necessary for certain dependencies that are only supported on Intel processors.

If you're someone who prefers to manage Python environments yourself, such as having multiple versions of Python to switch between, we recommend you install dbt Core via [`pip` instead](/docs/core/pip-install).

### Installing with Homebrew

Install [Homebrew](http://brew.sh/). Then run this one-time setup:

```shell
brew update
brew install git
brew tap dbt-labs/dbt
```

Now you're ready to install dbt. Once you know [which adapter](/docs/supported-data-platforms) you're using, you can install it as `dbt-<adapter>`. For instance, if using Postgres:

```shell
brew install dbt-postgres
```

Everywhere below that you see `<adapter>`, replace it with the adapter name you're using.

**Note**: If you're using an adapter that isn't available as a Homebrew formula, we recommend you use [pip](/docs/core/pip-install) instead.

### Upgrading dbt and your adapter

To upgrade dbt, use:

```shell
brew update
brew upgrade dbt-<adapter>
```

### Switching versions

You can install and use multiple versions of dbt with Homebrew through something called Homebrew "links." To allow installation of another version of dbt, first unlink the current version:

```shell
brew unlink dbt-<adapter>
brew install dbt-<adapter>@1.0.0
brew link dbt-<adapter>@1.0.0
```

Now, you can use dbt Core v1.0.0:

```shell
$ dbt --version
installed version: 1.0.0
   latest version: 1.0.0

Up to date!

Plugins:
  - <adapter>: 1.0.0
```

You can switch between versions by linking the one you want to use:

```shell
brew unlink dbt-<adapter>@1.0.0
brew link dbt-<adapter>@0.21.1
```
