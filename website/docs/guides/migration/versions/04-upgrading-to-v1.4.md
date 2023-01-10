---
title: "Upgrading to v1.4 (prerelease)"
description: New features and changes in dbt Core v1.4
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.3.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/get-started/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

## What to know before upgrading

We are committed to providing backward compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

### For those on versions .20 or .21

As of June 30, 2022, dbt Cloud has ceased all support for dbt Core versions older than v1.0. With the release of v1.4, these older versions have been removed from the docs site version menu as well. It is strongly recommded that anyone on a version lower than 1.1 upgrade as soon as possible.
Please visit [About dbt Core Versions](/dbt-versions/core) for more information

### For consumers of dbt artifacts (metadata)

The manifest schema version has updated to `v8`.
These changes are relevant for users who:
- parse/analyze contents of `manifest.json`
- have custom code accessing the [`model`](https://docs.getdbt.com/reference/dbt-jinja-functions/model) or [`graph`](https://docs.getdbt.com/reference/dbt-jinja-functions/graph) variables. For example:

```
{{ model.root_path }}
```

**Relevant changes:**
- `root_path` removed for all nodes
- remove some irrelevant/unused attributes from seed nodes, including `depends_on`
- macros no longer have `tags`
- docs blocks unique IDs now start with `doc` for consistency. 

## New and changed documentation

- **[Python 3.11](/faqs/Core/install-python-compatibility)**  was released in October 2022. It is officially supported in dbt-core v1.4, though full support depends also on your data platform adapter plugin.

According to the Python maintainers, "Python 3.11 is between 10-60% faster than Python 3.10." We encourage you to try a `dbt parse` with dbt Core v1.4 + Python 3.11, and compare it to the result of dbt parse on dbt Core v1.3 + Python 3.10. If you notice a significant speed increase, let us know!
- Some organizations have security requirements to pull resources only from internal services. To address the need to install packages from hosted environments such as Artifactory or cloud storage buckets, **[internally hosted tarball URLs](/docs/build/packages)** are supported for installing packages. 
- **The [local_md5](/referencedbt-jinja-functions/local-md5)** context variable is a new Jinja function that calculates an [MD5 hash](https://en.wikipedia.org/wiki/MD5).
- **[Exposures](/docs/build/exposures)** can now depend on `metrics`.
- Placeholder `--favor-state`
- Placeholder `incremental_predicates`
- Placeholder incremental modeling docs for BigQuery.


### Quick hits

- **[Stored procedures](/docs/build/python-models##Specific-data-platforms)** for Python models will be enabled for all dbt + Snowpark Python models starting with the release of dbt Core version 1.4.

