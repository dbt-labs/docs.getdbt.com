---
title: "Centos"
id: "centos"
---

Install dependencies:

```bash
$ sudo yum install redhat-rpm-config gcc libffi-devel python-devel \
    openssl-devel
```

Then, install using `pip`:

:::caution Python Requirements

The dbt CLI is compatible with Python versions 3.6 and higher. As of v0.15.0, dbt is no longer compatible with Python2.

:::

```bash
pip install dbt
```

To upgrade, use:

```bash
pip install --upgrade dbt
```