---
title: What version of Python can I use?
description: "Python versions supported with dbt Core"
sidebar_label: 'Python version'
id: install-python-compatibility
---

import Pythonmatrix from '/snippets/_python-compatibility-matrix.md';

Use this table to match <Constant name="core" /> versions with their compatible Python versions. New [dbt minor versions](/docs/dbt-versions/core#minor-versions) will add support for new Python3 minor versions when all dependencies can support it. In addition, dbt minor versions will withdraw support for old Python3 minor versions before their [end of life](https://endoflife.date/python).

<Pythonmatrix/>

Adapter plugins and their dependencies are not always compatible with the latest version of Python.

Note that this shouldn't be confused with [dbt Python models](/docs/build/python-models#specific-data-platforms). If you're using a data platform that supports Snowpark, use the `python_version` config to run a Snowpark model with [Python versions](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup) 3.9, 3.10, or 3.11.
