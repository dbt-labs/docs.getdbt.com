---
title: "Install from source"
id: "from-source"
---

dbt Core is open source software, as are almost all adapter plugins. As such, the codebases are freely available to download and build from source. To do this, you can clone the repositories from GitHub and install the local version using `pip`.

You will also need to follow this process if you'd like to contribute to the project by fixing a bug or implementing a sought-after feature. For more details, read the [core contributing guide](https://github.com/dbt-labs/dbt/blob/HEAD/CONTRIBUTING.md).

### Core

To install from source:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt
pip install -r requirements.txt
```

This will install `dbt-core` and `dbt-postgres`. To install in editable mode (includes your local changes as you make them), use `pip install -e editable-requirements.txt` instead.

### Plugin

To install an adapter plugin from source, first locate its repository. For instance, the `dbt-redshift` adapter is located at https://github.com/dbt-labs/dbt-redshift.git, so I can clone it and install from there:

```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
pip install .
```

You do _not_ need to install `dbt-core` before installing an adapter plugin—it includes `dbt-core` among its dependencies, and it will install the latest compatible version automatically.

To install in editable mode, such as while contributing, use `pip install -e .` instead.

<FAQ src="install-pip-os-prereqs" />
<FAQ src="install-python-compatibility" />
<FAQ src="install-pip-best-practices" />
