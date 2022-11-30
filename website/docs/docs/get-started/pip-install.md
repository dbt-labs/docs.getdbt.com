---
title: "Install with pip"
description: "You can use pip to install dbt Core and adapter plugins from the command line."
---

You need to use `pip` to install dbt Core on Windows or Linux operating systems. You should use [Homebrew](/docs/get-started/homebrew-install) for installing dbt Core on a MacOS.

You can install dbt Core and plugins using `pip` because they are Python modules distributed on [PyPI](https://pypi.org/project/dbt/). We recommend using virtual environments when installing with `pip`.

<FAQ src="Core/install-pip-os-prereqs" />
<FAQ src="Core/install-python-compatibility" />
<FAQ src="Core/install-pip-best-practices" />

Once you know [which adapter](supported-data-platforms) you're using, you can install it as `dbt-<adapter>`. For example, if using Postgres:

```shell
pip install dbt-postgres
```

This will install `dbt-core` and `dbt-postgres` _only_:

```shell
$ dbt --version
installed version: 1.0.0
   latest version: 1.0.0

Up to date!

Plugins:
  - postgres: 1.0.0
```

All adapters build on top of `dbt-core`. Some also depend on other adapters: for example, `dbt-redshift` builds on top of `dbt-postgres`. In that case, you would see those adapters included by your specific installation, too.

### Upgrading

To upgrade a specific adapter plugin:

```shell
pip install --upgrade dbt-<adapter>
```

### Install dbt-core only

If you're building a tool that integrates with dbt Core, you may want to install the core library alone, without a database adapter. Note that you won't be able to use dbt as a CLI tool.

```shell
pip install dbt-core
```

### `pip install dbt`

Note that, as of v1.0.0, `pip install dbt` is no longer supported and will raise an explicit error. Since v0.13, the PyPI package named `dbt` was a simple "pass-through" of `dbt-core` and the four original database adapter plugins. For v1, we formalized that split.

If you have workflows or integrations that relied on installing the package named `dbt`, you can achieve the same behavior going forward by installing the same five packages that it used:

```shell
pip install \
  dbt-core \
  dbt-postgres \
  dbt-redshift \
  dbt-snowflake \
  dbt-bigquery
```

Or, better yet, just install the package(s) you need!
