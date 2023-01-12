---
title: "Upgrading to v1.4 (prerelease)"
description: New features and changes in dbt Core v1.4
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.4.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/get-started/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

**Planned final release:** January 2023

dbt Core v1.4 is a "behind-the-scenes" release. We've been hard at work rebuilding `dbt-core` internals on top of more-solid foundations, to enable an exciting year of new feature development. Check out the [v1.5 milestone](https://github.com/dbt-labs/dbt-core/milestone/82) in GitHub for a preview of what's planned for April.

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For consumers of dbt artifacts (metadata)

The manifest schema version has updated to `v8`. These changes are relevant for people who parse or analyze the contents of the `manifest.json` file, or who have custom code accessing the [`model`](https://docs.getdbt.com/reference/dbt-jinja-functions/model) or [`graph`](https://docs.getdbt.com/reference/dbt-jinja-functions/graph) variables, e.g. `{{ model.root_path }}`.

Relevant changes:
- The `root_path` attribute has been removed for all nodes to reduce duplicative information.
- Unused attributes have been removed from seed `nodes`, including `depends_on`, and from `macros`, including `tags`.
- The `unique_id` of docs blocks now start with `doc` for consistency with other resource types.

### For maintainers of adapter plugins

Link to GH discussion forthcoming

## New and changed documentation

- [**Python support**](/faqs/Core/install-python-compatibility): Python 3.11 was released in October 2022. It is officially supported in dbt-core v1.4, although full support depends also on the adapter plugin for your data platform. According to the Python maintainers, "Python 3.11 is between 10-60% faster than Python 3.10." We encourage you to try [`dbt parse`](parse) with dbt Core v1.4 + Python 3.11, and compare the timing with dbt Core v1.3 + Python 3.10. Let us know what you find!
- [**Metrics**](/docs/build/metrics): `time_grain` is optional, to provide better ergonomics around metrics that aren't time-bound.
- **dbt-Jinja context:** The [local_md5](/reference/dbt-jinja-functions/local-md5) context method will calculate an [MD5 hash](https://en.wikipedia.org/wiki/MD5) for use _within_ dbt. (Not to be confused with SQL md5!)
- [**Exposures**](/docs/build/exposures) can now depend on `metrics`.
- [**"Tarball" packages**](packages#internally-hosted-tarball-URL): Some organizations have security requirements to pull resources only from internal services. To address the need to install packages from hosted environments (such as Artifactory or cloud storage buckets), it's possible to specify any accessible URL where a compressed dbt package can be downloaded.
- [**Granular "warn error" configuration**](global-configs#warnings-as-errors): Thanks to a full cleanup and consolidation of warning and exception classes within `dbt-core`, it is now possible to define a more granular `--warn-error-options` configuration that specifies the exact warnings you do (or don't) want dbt to treat as errors.
- [**Deferral**](defer#favor-state) supports an optional configuration, `--favor-state`.

### Advanced configurations for incremental models

- The most popular adapters now support an `incremental_predicates` config, to enable greater flexibility when tuning performance in `merge` and `delete` statements for large datasets. ([dbt-labs/docs.getdbt.com/issues/2636](https://github.com/dbt-labs/docs.getdbt.com/issues/2636))
- **BigQuery:** The `insert_overwrite` incremental strategy supports a new (old) mechanism, [`time_ingestion_partitioning`](bigquery-configs#partitioning-by-an-ingestion-date-or-timestamp) + [`copy_partitions`](#copying-ingestion-time-partitions), that can yield significant savings in cost + time for large datasets.

### Updates to Python models

- Python models are [configured to materialize](python-models#materializations) as `table` by default.
- Python models [running on Snowpark](python-models#specific-data-platforms) will use "anonymous" stored procedures by default, enabling a small speedup and a cleaner query history.
