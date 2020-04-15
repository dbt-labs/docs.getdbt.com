---
title: "Installation"
id: "cli-installation"
---

We recommend you use one of our OS-specific guides for help with installing dbt. If your OS is not listed, or you prefer to use `pip`, please see the instructions below.

## OS-specific guides
- [macOS](macos)
- [Windows](windows)
- [Ubuntu / Debian](ubuntu-debian)
- [CentOS](centos)

## pip

<Callout type="info" title="Python3">

The dbt CLI is compatible with Python versions 3.6 and higher. As of v0.15.0, dbt is no longer compatible with Python2.

</Callout>

dbt is a Python module distributed on [pypi](https://pypi.org/project/dbt/), and can be installed via `pip`. We recommend using virtual environments when installing dbt via pip.
## Installation
```bash
pip install dbt
```

## Upgrading
To upgrade dbt, use:
```
pip install --upgrade dbt
```
