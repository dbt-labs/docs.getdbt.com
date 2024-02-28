---
title: What version of Python can I use?
description: "Python versions 3.8 and newer can be used with dbt Core"
sidebar_label: 'Python version'
id: install-python-compatibility
---

Adapter plugins and their dependencies are not always compatible with the latest version of Python. For example, dbt-snowflake v0.15 is not compatible with Python 3.12, but dbt-snowflake versions 0.20+ are.

New dbt minor versions will add support for new Python3 minor versions as soon as all dependencies can support it. In turn, dbt minor versions will drop support for old Python3 minor versions right before they reach [end of life](https://endoflife.date/python).

dbt Core does not support Python2.

import Pythonmatrix from '/snippets/_python-compatibility-matrix.md';

<Pythonmatrix/>
