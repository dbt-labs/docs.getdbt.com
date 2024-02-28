---
title: What version of Python can I use?
description: "Python versions 3.8 and newer can be used with dbt Core"
sidebar_label: 'Python version'
id: install-python-compatibility
---

| dbt-core → <br/> Python ↓ | 1.0 | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 1.6 | 1.7 | 1.8 |
|---------------------------:|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **3.8**                   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |
| **3.9**                   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |
| **3.10**                  | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |
| **3.11**                  | ✖️   | ✖️   | ✖️   | ✖️   | ✓   | ✓   | ✓   | ✓   | ✓   |
| **3.12**                  | ✖️   | ✖️   | ✖️   | ✖️   | ✖️   | ✖️   | ✖️   | ✓   | ✓   |

Adapter plugins and their dependencies are not always compatible with the latest version of Python. For example, dbt-snowflake v0.19 is not compatible with Python 3.9, but dbt-snowflake versions 0.20+ are.

New dbt minor versions will add support for new Python3 minor versions as soon as all dependencies can support it. In turn, dbt minor versions will drop support for old Python3 minor versions right before they reach [end of life](https://endoflife.date/python).

Since v0.15.0, dbt Core no longer supports Python2.
