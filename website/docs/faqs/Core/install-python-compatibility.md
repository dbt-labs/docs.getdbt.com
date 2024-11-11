---
title: What version of Python can I use?
description: "Python versions supported with dbt Core"
sidebar_label: 'Python version'
id: install-python-compatibility
---

import Pythonmatrix from '/snippets/_python-compatibility-matrix.md';

Use this table to match dbt-core versions with their compatible Python versions. New [dbt minor versions](/docs/dbt-versions/core#minor-versions) will add support for new Python3 minor versions when all dependencies can support it. In addition, dbt minor versions will withdraw support for old Python3 minor versions before their [end of life](https://endoflife.date/python).

<Pythonmatrix/>

Adapter plugins and their dependencies are not always compatible with the latest version of Python. For example, dbt-snowflake v0.19 is not compatible with Python 3.9, but dbt-snowflake versions 0.20+ are.
