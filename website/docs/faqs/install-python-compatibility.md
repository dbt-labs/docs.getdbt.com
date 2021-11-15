---
title: What version of Python can I use?
---

As of v1.0.0, `dbt-core` is compatible with Python versions 3.7, 3.8, and 3.9.

Some adapter plugins may have dependencies that are not compatible with the latest version of Python. For example, dbt-snowflake v0.19 is not compatible with Python 3.9, but dbt-snowflake versions 0.20+ are.

New dbt minor versions will add support for new Python3 minor versions as soon as all dependencies can support it. In turn, dbt minor versions will drop support for old Python3 minor versions when they are about to reach end of life.

Since v0.15.0, dbt has no longer supported Python2.
