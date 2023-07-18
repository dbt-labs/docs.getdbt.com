---
title: "Install from source"
description: "You can install dbt Core from its GitHub code source."
---

dbt Core and almost all of its adapter plugins are open source software. As such, the codebases are freely available to download and build from source. You might install from source if you want the latest code or want to install dbt from a specific commit. This might be helpful when you are contributing changes, or if you want to debug a past change.

To download from source, you would clone the repositories from GitHub, making a local copy, and then install the local version using `pip`.

Downloading and building dbt Core will enable you to contribute to the project by fixing a bug or implementing a sought-after feature. For more details, read the [contributing guidelines](https://github.com/dbt-labs/dbt-core/blob/HEAD/CONTRIBUTING.md).

### Installing dbt Core

To install `dbt-core` from the GitHub code source:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt-core
pip install -r requirements.txt
```

This will install `dbt-core` and `dbt-postgres`. To install in editable mode (includes your local changes as you make them), use `pip install -e editable-requirements.txt` instead.

### Installing adapter plugins

To install an adapter plugin from source, you will need to first locate its source repository. For instance, the `dbt-redshift` adapter is located at https://github.com/dbt-labs/dbt-redshift.git, so I can clone it and install from there:

```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
pip install .
```

You do _not_ need to install `dbt-core` before installing an adapter plugin -- the plugin includes `dbt-core` among its dependencies, and it will install the latest compatible version automatically.

To install in editable mode, such as while contributing, use `pip install -e .` instead.

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />
<FAQ path="Core/install-pip-best-practices" />
