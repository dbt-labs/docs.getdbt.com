---
title: "Homebrew"
---

dbt Labs maintains Homebrew formulae for the four oldest and most popular adapter plugins.

Reasons to use Homebrew:
- You use MacOS for local development
- You use dbt with one of Postgres, Redshift, Snowflake, or BigQuery
- You're not sure if you have system requirements (such as python3) already installed

Note that:
- Installation with Homebrew can take longer than installing with other methods, because `brew` takes care of more setup behind the scenes
- If you're using an M1 Mac, we recommend that you install dbt via Homebrew with [Rosetta](https://support.apple.com/en-us/HT211861). This is necessary for certain dependencies that are only supported on Intel processors.

### Installation

Install [Homebrew](http://brew.sh/). Then run this one-time setup:

```shell
brew update
brew install git
brew tap dbt-labs/dbt
```

Now you're ready to install dbt. Once you know [which adapter](available-adapters) you're using, you can install it as `dbt-<adapter>`. For instance, if using Postgres:
```
brew install dbt-postgres
```

Everywhere below that you see `<adapter>`, replace it with the adapter name you're using.

**Note**: If you're using an adapter that isn't available as a Homebrew formula, we recommend you use [pip](install/pip) instead.

### Upgrading

To upgrade dbt, use:

```shell
brew update
brew upgrade dbt-<adapter>
```

### Switching versions

You can install and use multiple versions of dbt with Homebrew through something called Homebrew "links." To allow installation of another version of dbt, first unlink the current version:

```shell
brew unlink dbt-<adapter>
brew install dbt-<adapter>@0.21.0
brew link dbt-<adapter>@0.21.0
```

Now, you can use dbt version 0.21.0:

```
$ dbt --version
installed version: 0.21.0
   latest version: 0.21.0

Up to date!

Plugins:
  - bigquery: 0.21.0
  - snowflake: 0.21.0
  - redshift: 0.21.0
  - postgres: 0.21.0
```

You can switch between versions by linking the one you want to use:

```shell
brew unlink dbt-<adapter>@0.21.0
brew link dbt-<adapter>
```
