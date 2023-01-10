---
title: "Upgrading to v1.4 (prerelease)"
description: New features and changes in dbt Core v1.4
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.4.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/get-started/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

## What to know before upgrading

We are committed to providing backward compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For consumers of dbt artifacts (metadata)

The manifest schema version has updated to `v8`.
These changes are relevant for users who:
- parse/analyze contents of `manifest.json`
- have custom code accessing the [`model`](https://docs.getdbt.com/reference/dbt-jinja-functions/model) or [`graph`](https://docs.getdbt.com/reference/dbt-jinja-functions/graph) variables. For example:

```
{{ model.root_path }}
```

**Relevant changes:**
- The `root_path` attribute is removed for all nodes, to reduce duplicative information.
- Unused attributes have been removed from seed `nodes`, including `depends_on`, and from `macros`, including `tags`.
- The `unique_id` of docs blocks now start with `doc`, for consistency with other resource types.
- Docs blocks unique IDs now start with `doc` for consistency. 

## New and changed documentation

- **[Python 3.11](/faqs/Core/install-python-compatibility)** was released in October 2022. It is officially supported in dbt-core v1.4, though full support depends also on your data platform adapter plugin.
According to the Python maintainers, "Python 3.11 is between 10-60% faster than Python 3.10." We encourage you to try a `dbt parse` with dbt Core v1.4 + Python 3.11, and compare it to the result of dbt parse on dbt Core v1.3 + Python 3.10.
- [Install packages from tarball URLs](/docs/build/packages) &mdash; Some organizations have security requirements to pull resources only from internal services. To address the need to install packages from hosted environments such as Artifactory or cloud storage buckets, installing packages now support **[internally hosted tarball URLs](/docs/build/packages)**. 
- **The [local_md5](/reference/dbt-jinja-functions/local-md5)** context variable is a new Jinja function that calculates an [MD5 hash](https://en.wikipedia.org/wiki/MD5).
- **[Exposures](/docs/build/exposures)** can now depend on `metrics`.
- [Coming soon] `--favor-state` ([dbt-labs/docs.getdbt.com/issues/2021](https://github.com/dbt-labs/docs.getdbt.com/issues/2021))
- [Coming soon] `incremental_predicates` ([dbt-labs/docs.getdbt.com/issues/2636](https://github.com/dbt-labs/docs.getdbt.com/issues/2636))
- [Coming soon] BigQuery: `time_ingestion_partitioning` + `insert_overwrite` ([dbt-labs/docs.getdbt.com/issues/2426](https://github.com/dbt-labs/docs.getdbt.com/issues/2426))


### Python updates

- **[Stored procedures](/docs/build/python-models##Specific-data-platforms)** for Python models will be enabled for all dbt + Snowpark Python models starting with the release of dbt Core version 1.4.

