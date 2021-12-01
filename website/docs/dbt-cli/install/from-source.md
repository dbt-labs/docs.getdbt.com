---
title: "Install dbt from source"
id: "from-source"
description: ""
---

dbt Core and almost all of its adaptor plugins are open source software. As such, the codebases are freely available to download and build from source. To do this, you can clone the repositories from GitHub, which makes a local copy, and then install the local version using `pip`.

You will also need download and build dbt Core if you'd like to contribute to the project by fixing a bug or implementing a sought-after feature. For more details, read the [core contributing guide](https://github.com/dbt-labs/dbt/blob/HEAD/CONTRIBUTING.md).

### Installing dbt Core

To install dbt from the GitHub source:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt-core
pip install -r requirements.txt
```

This will install `dbt-core` and `dbt-postgres`. To install in editable mode (includes your local changes as you make them), use `pip install -e editable-requirements.txt` instead.

### Installing adapter plugins

To install an adapter plugin from source, first locate its repository. For instance, the `dbt-redshift` adapter is located at https://github.com/dbt-labs/dbt-redshift.git, so I can clone it and install from there:

```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
pip install .
```

You do _not_ need to install `dbt-core` before installing an adapter plugin -- it includes `dbt-core` among its dependencies, and it will install the latest compatible version automatically.

To install in editable mode, such as while contributing, use `pip install -e .` instead.

<FAQ src="install-pip-os-prereqs" />
<FAQ src="install-python-compatibility" />
<FAQ src="install-pip-best-practices" />
