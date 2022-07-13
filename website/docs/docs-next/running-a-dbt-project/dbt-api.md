---
title: "Using the Python API"
id: "dbt-api"
---

The primary interface into `dbt-core` is on the command line. It is designed to be invoked with commands, arguments, and flags. Starting in v1, this interface is contracted, with backwards compatibility guaranteed.

It _is_ possible to import and invoke dbt as a Python module. This API is still not contracted or documented, and it is liable to change in future versions of `dbt-core` without warning. Please use caution when upgrading across versions of dbt if you choose to run dbt in this manner!

We aim to contract and document an increasing number of Python interfaces within `dbt-core`. Today, those interfaces are:
- [Adapter plugin](building-a-new-adapter) classes and methods. These are liable to change in minor versions _only_, and we will aim for backwards compatibility whenever possible.
- [Events](events-logging), Python objects that dbt emits as log messages.
