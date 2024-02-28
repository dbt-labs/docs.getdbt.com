---
title: "Install with pip"
description: "You can use pip to install dbt Core and adapter plugins from the command line."
---

You need to use `pip` to install dbt Core on Windows or Linux operating systems. You can use `pip` or [Homebrew](/docs/core/homebrew-install) for installing dbt Core on a MacOS.

You can install dbt Core and plugins using `pip` because they are Python modules distributed on [PyPI](https://pypi.org/project/dbt-core/).

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />

### Using virtual environments

We recommend using virtual environments (venv) to namespace pip modules.

1. Create a new venv:

```shell
python3 -m venv dbt-env				# create the environment
```

2. Activate that same virtual environment each time you create a shell window or session:

```shell
source dbt-env/bin/activate			# activate the environment for Mac and Linux OR
dbt-env\Scripts\activate			# activate the environment for Windows
```

#### Create an alias

To activate your dbt environment with every new shell window or session, you can create an alias for the source command in your $HOME/.bashrc, $HOME/.zshrc, or whichever config file your shell draws from. 

For example, add the following to your rc file, replacing <PATH_TO_VIRTUAL_ENV_CONFIG> with the path to your virtual environment configuration.

```shell
alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
```

### Installing the adapter

Once you decide [which adapter](/docs/supported-data-platforms) you're using, you can install using the command line. Beginning in v1.8, you must install both dbt Core and the desired adapter because `dbt-core` has been decoupled from the adapter installation.

<VersionBlock firstVersion="1.8">

```shell
python -m pip install dbt-core dbt-ADAPTER_NAME. 
```

</VersionBlock>

<VersionBlock lastVersion="1.7">

```shell
python -m pip install dbt-ADAPTER_NAME
```

</VersionBlock>

For example, if using Postgres:

<VersionBlock lastVersion="1.8">

```shell
python -m pip install dbt-core dbt-postgres
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
</VersionBlock>

<VersionBlock lastVersion="1.7">

```shell
python -m pip install dbt-postgres
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

Some adapters depend on other adapters. For example, `dbt-redshift` builds on top of `dbt-postgres`. In that case, you would see those adapters included by your specific installation, too.
</VersionBlock>

### Upgrade adapters

To upgrade a specific adapter plugin:

```shell
python -m pip install --upgrade dbt-<adapter>
```

### Install dbt-core only

If you're building a tool that integrates with dbt Core, you may want to install the core library alone, without a database adapter. Note that you won't be able to use dbt as a CLI tool.

```shell
python -m pip install dbt-core
```

### Change dbt Core versions

You can upgrade or downgrade versions of dbt Core by using the `--upgrade` option on the command line (CLI). For more information, see [Best practices for upgrading in Core versions](/docs/dbt-versions/core#best-practices-for-upgrading).

To upgrade dbt to the latest version:

```
python -m pip install --upgrade dbt-core
```

To downgrade to an older version, specify the version you want to use. This command can be useful when you're resolving package dependencies. As an example:

```
python -m pip install --upgrade dbt-core==0.19.0
```

### `pip install dbt`

Note that, as of v1.0.0, `pip install dbt` is no longer supported and will raise an explicit error. Since v0.13, the PyPI package named `dbt` was a simple "pass-through" of `dbt-core` and the four original database adapter plugins. For v1, we formalized that split.

If you have workflows or integrations that relied on installing the package named `dbt`, you can achieve the same behavior going forward by installing the same five packages that it used:

```shell
python -m pip install \
  dbt-core \
  dbt-postgres \
  dbt-redshift \
  dbt-snowflake \
  dbt-bigquery \
  dbt-trino
```

Or, better yet, just install the package(s) you need!
