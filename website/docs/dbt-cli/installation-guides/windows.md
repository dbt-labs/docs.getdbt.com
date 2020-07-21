---
title: "Windows"
id: "windows"
---

## pip

Before starting, you'll need to install [Git for Windows](https://git-scm.com/downloads) and [Python version 3.5 or higher for Windows](https://www.python.org/downloads/windows/).

Open up Windows powershell __as an administrator__, and install dbt with `pip`:

:::caution Python Requirements

The dbt CLI is compatible with Python versions 3.6 and higher. As of dbt v0.15.0, dbt is no longer compatible with Python2.

:::

```bash
pip install dbt
```

To upgrade, use:

```bash
pip install --upgrade dbt
```

Run 'dbt init' to prepare the environment for creating a project https://docs.getdbt.com/reference/commands/init/
