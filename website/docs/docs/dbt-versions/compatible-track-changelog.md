---
title: "dbt platform compatible track - changelog"
sidebar_label: "Compatible track changelog"
description: "The Compatible release track updates once per month, and it includes up-to-date open source versions as of the monthly release."
---

Select the "Compatible" and "Extended" release tracks if you need a less-frequent release cadence, the ability to test new dbt releases before they go live in production, and/or ongoing compatibility with the latest open source releases of <Constant name="core" />.

Each monthly "Compatible" release includes functionality matching up-to-date open source versions of <Constant name="core" /> and adapters at the time of release.

For more information, see [release tracks](/docs/dbt-versions/cloud-release-tracks).

## September 2025

Release Date: September 10, 2025

This compatible release includes functionality from the following versions of dbt Core OSS:

```
dbt-core==1.10.11

# shared interfaces
dbt-adapters==1.16.6
dbt-common==1.29.0
dbt-semantic-interfaces==0.9.0

# adapters
dbt-athena==1.9.5
dbt-bigquery==1.10.2
dbt-databricks==1.10.12
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.1
dbt-protos==1.0.348
dbt-redshift==1.9.5
dbt-sl-sdk[sync]==0.13.0
dbt-snowflake==1.10.2
dbt-spark==1.9.3
dbt-synapse==1.8.4
dbt-teradata==1.10.0
dbt-trino==1.9.3
```

Changelogs:
- [dbt-core 1.10.11](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md#dbt-core-11011---september-04-2025)
- [dbt-adapters 1.16.6](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1166---september-03-2025)
- [dbt-common 1.29.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1290---september-04-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.10.12](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-11012-september-8-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-postgres/CHANGELOG.md#changelog)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.2](http://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.4](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.10.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.10.0)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)

## August 2025

Release date: August 12, 2025

### Notable dbt Core OSS changes

This compatible upgrade brings in a minor update to `dbt-core`, from `dbt-core==1.9.8` to `dbt-core==1.10.8`. Some noteworthy changes from this minor version include:
* Introduction of several new [deprecations](/reference/deprecations) that warn about project incompatibilities between dbt Core and Fusion engines.
* Support for defining `meta` and `tags` within `config` of columns and exposures, as well as defining `freshness` within `config` of sources. These changes lead to manifest.json minor schema evolutions which may cause an intermittent increase in false positives during `state:modified` comparisons.

### dbt cloud-based platform 

### Fixes

- Update generate publications script to add project and env id in generated publication file
- Use JSON stream for publication artifact generation script
- Get environment variables correctly from environment for publication artifacts
- Adding `--resource-type` and `--exclude-resource-type` flags to Semantic Layer commands
- Azure DevOps Private Packages are now properly matched with Private Package Definition in packages.yml

### Under the Hood

- Prepare support for Private Package's URLs with multiple levels
- Disable telemetry client logger
- Update semantic layer SDK to 0.11

This release includes functionality from the following versions of dbt Core OSS:

```
dbt-core==1.10.8

# shared interfaces
dbt-adapters==1.16.3
dbt-common==1.27.1
dbt-semantic-interfaces==0.9.0
dbt-extractor==0.6.0
dbt-protos==1.0.348

# dbt-adapters
dbt-athena==1.9.4
dbt-bigquery==1.10.1
dbt-databricks==1.10.10
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-redshift==1.9.5
dbt-snowflake==1.10.0
dbt-spark==1.9.3
dbt-synapse==1.8.2
dbt-teradata==1.9.3
dbt-trino==1.9.3
```

Changelogs:
- [dbt-core 1.10.8](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md#dbt-core-1108---august-12-2025)
- [dbt-adapters 1.16.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1163---july-21-2025)
- [dbt-common 1.25.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1271---july-21-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.10.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-bigquery/CHANGELOG.md#dbt-bigquery-1101---july-29-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-1109-august-7-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.10.0](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-1100-rc3---june-24-2025)
- [dbt-spark 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-193---july-16-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.3](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.3)
- [dbt-trino 1.9.3](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-193---july-22-2025)


## July 2025

The compatible release slated for July 2025 will be skipped in order to further stabilize the minor upgrade of `dbt-core==1.10.0` ([released June 16, 2025](https://pypi.org/project/dbt-core/1.10.0/)) across the dbt platform. 

Compatible releases will resume in August 2025.

## June 2025

Release date: June 12, 2025

This release includes functionality from the following versions of dbt Core OSS:

```
dbt-core==1.9.8

# shared interfaces
dbt-adapters==1.15.3
dbt-common==1.25.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.4
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-extractor==0.6.0
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-protos==1.0.317
dbt-redshift==1.9.5
dbt-sl-sdk-internal[sync]==0.7.0
dbt-sl-sdk[sync]==0.7.0
dbt-snowflake==1.9.4
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.2
dbt-trino==1.9.2
```

Changelogs:
- [dbt-core 1.9.8](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-198---june-10-2025)
- [dbt-adapters 1.15.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1153---may-20-2025)
- [dbt-common 1.25.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1250---may-20-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-194---may-02-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-192---june-03-2025)

## May 2025

Release date: May 19, 2025

### dbt cloud-based platform

These changes reflect capabilities that are only available in the dbt platform.

### Fixes

- Get environment variables correctly from the environment for publication artifacts

### Under the hood

- Create JSON schemas for PublicationArtifact and ResolvedProjectsArtifact

This release includes functionality from the following versions of dbt Core OSS:
```
dbt-core==1.9.4

# shared interfaces
dbt-adapters==1.14.8
dbt-common==1.24.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.4
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-redshift==1.9.5
dbt-snowflake==1.9.4
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.2
dbt-trino==1.9.1
```

Changelogs:
- [dbt-core 1.9.4](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-194---april-02-2025)
- [dbt-adapters 1.14.8](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1148---april-25-2025)
- [dbt-common 1.24.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1240---may-09-2025)
- [dbt-athena 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-194---april-28-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-195---may-13-2025)
- [dbt-snowflake 1.9.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-194---may-02-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-191---march-26-2025)

## April 2025

Release date: April 9, 2025

### dbt Cloud 

These changes reflect capabilities that are only available in dbt Cloud.

### Under the Hood

- Add secondary profiles to profile.py

This release includes functionality from the following versions of dbt Core OSS:
```
dbt-core==1.9.4

# shared interfaces
dbt-adapters==1.14.5
dbt-common==1.17.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.3
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-fabric==1.9.4
dbt-postgres==1.9.0
dbt-redshift==1.9.3
dbt-snowflake==1.9.2
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.2
dbt-trino==1.9.1
```

Changelogs:
- [dbt-core 1.9.4](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-194---april-02-2025)
- [dbt-adapters 1.14.5](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1145---april-07-2025)
- [dbt-common 1.17.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1170---march-31-2025)
- [dbt-athena 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-athena/CHANGELOG.md#dbt-athena-193---april-07-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.4](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.4)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.3](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-193---april-01-2025)
- [dbt-snowflake 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-192---march-07-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.2)
- [dbt-trino 1.9.1](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-191---march-26-2025)

## March 2025

Release date: March 11, 2025

This release includes functionality from the following versions of <Constant name="core" /> OSS:
```
dbt-core==1.9.3

# shared interfaces
dbt-adapters==1.14.1
dbt-common==1.15.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.2
dbt-bigquery==1.9.1
dbt-databricks==1.9.7
dbt-fabric==1.9.2
dbt-postgres==1.9.0
dbt-redshift==1.9.1
dbt-snowflake==1.9.2
dbt-spark==1.9.2
dbt-synapse==1.8.2
dbt-teradata==1.9.1
dbt-trino==1.9.0
```

Changelogs:
- [<Constant name="core" /> 1.9.3](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-193---march-07-2025)
- [dbt-adapters 1.14.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1141---march-04-2025)
- [dbt-common 1.15.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md#dbt-common-1150---february-14-2025)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.7](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-197-feb-25-2025)
- [dbt-fabric 1.9.2](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.2)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-redshift/CHANGELOG.md#dbt-redshift-191---march-07-2025)
- [dbt-snowflake 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-snowflake/CHANGELOG.md#dbt-snowflake-192---march-07-2025)
- [dbt-spark 1.9.2](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-spark/CHANGELOG.md#dbt-spark-192---march-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.1](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.1)
- [dbt-trino 1.9.0](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-190---december-20-2024)

## February 2025

Release date: February 12, 2025

### dbt Cloud 

These changes reflect capabilities that are only available in <Constant name="cloud" />.

### Features

- Add [`event_time`](/reference/resource-configs/event-time) to cross-project ref artifact.
- Include debug exception message in ObservabilityMetric.

### Fixes

- Adding support for deferral against the new time spine definition.
- Fix error messages for SL query.
- Semantic Layer commands now respect `--favor-state` when running with `--defer`.

This release includes functionality from the following versions of <Constant name="core" /> OSS:
```
dbt-core==1.9.2

# shared interfaces
dbt-adapters==1.14.0
dbt-common==1.14.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.1
dbt-bigquery==1.9.1
dbt-databricks==1.9.4
dbt-fabric==1.9.0
dbt-postgres==1.9.0
dbt-redshift==1.9.0
dbt-snowflake==1.9.1
dbt-spark==1.9.1
dbt-synapse==1.8.2
dbt-teradata==1.9.1
dbt-trino==1.9.0
```

Changelogs:
- [<Constant name="core" /> 1.9.2](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-192---january-29-2025)
- [dbt-adapters 1.14.0](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1140---february-07-2025)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.4](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-194-jan-30-2024)
- [dbt-fabric 1.9.0](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.0)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.1](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-191---february-07-2025)
- [dbt-spark 1.9.1](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-191---february-07-2025)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.1](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.1)
- [dbt-trino 1.9.0](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-190---december-20-2024)

## January 2025

Release date: January 14, 2025

### dbt Cloud 

These changes reflect capabilities that are only available in <Constant name="cloud" />.

### Features

- Filter out external exposures in dbt compare.

### Fixes

- Use `meta.dbt_cloud_id` to `build unique_id` for manually defined exposure for merging against a duplicated exposure.

This release includes functionality from the following versions of <Constant name="core" /> OSS:
```
dbt-core==1.9.1

# shared interfaces
dbt-adapters==1.13.1
dbt-common==1.14.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.0
dbt-bigquery==1.9.1
dbt-databricks==1.9.1
dbt-fabric==1.9.0
dbt-postgres==1.9.0
dbt-redshift==1.9.0
dbt-snowflake==1.9.0
dbt-spark==1.9.0
dbt-synapse==1.8.2
dbt-teradata==1.9.0
dbt-trino==1.9.0
```

Changelogs:
- [<Constant name="core" /> 1.9.1](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-191---december-16-2024)
- [dbt-adapters 1.13.1](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1131---january-10-2025)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.1](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-191---january-10-2025)
- [dbt-databricks 1.9.1](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-191-december-16-2024)
- [dbt-fabric 1.9.0](https://github.com/microsoft/dbt-fabric/releases/tag/v1.9.0)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.0](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-190---december-09-2024)
- [dbt-spark 1.9.0](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-190---december-10-2024)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.9.0](https://github.com/Teradata/dbt-teradata/releases/tag/v1.9.0)
- [dbt-trino 1.9.0](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-190---december-20-2024)

## December 2024

Release date: December 12, 2024

This release includes functionality from the following versions of <Constant name="core" /> OSS:
```
dbt-core==1.9.0

# shared interfaces
dbt-adapters==1.10.4
dbt-common==1.14.0
dbt-semantic-interfaces==0.7.4

# adapters
dbt-athena==1.9.0
dbt-bigquery==1.9.0
dbt-databricks==1.9.0
dbt-fabric==1.8.8
dbt-postgres==1.9.0
dbt-redshift==1.9.0
dbt-snowflake==1.9.0
dbt-spark==1.9.0
dbt-synapse==1.8.2
dbt-teradata==1.8.2
dbt-trino==1.8.5
```

Changelogs:
- [<Constant name="core" /> 1.9.0](https://github.com/dbt-labs/dbt-core/blob/1.9.latest/CHANGELOG.md#dbt-core-190---december-09-2024)
- [dbt-adapters 1.10.4](https://github.com/dbt-labs/dbt-adapters/blob/main/dbt-adapters/CHANGELOG.md#dbt-adapters-1104---november-11-2024)
- [dbt-common 1.14.0](https://github.com/dbt-labs/dbt-common/blob/main/CHANGELOG.md)
- [dbt-bigquery 1.9.0](https://github.com/dbt-labs/dbt-bigquery/blob/1.9.latest/CHANGELOG.md#dbt-bigquery-190---december-09-2024)
- [dbt-databricks 1.9.0](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md#dbt-databricks-190-december-9-2024)
- [dbt-fabric 1.8.8](https://github.com/microsoft/dbt-fabric/blob/v1.8.latest/CHANGELOG.md)
- [dbt-postgres 1.9.0](https://github.com/dbt-labs/dbt-postgres/blob/main/CHANGELOG.md#dbt-postgres-190---december-09-2024)
- [dbt-redshift 1.9.0](https://github.com/dbt-labs/dbt-redshift/blob/1.9.latest/CHANGELOG.md#dbt-redshift-190---december-09-2024)
- [dbt-snowflake 1.9.0](https://github.com/dbt-labs/dbt-snowflake/blob/1.9.latest/CHANGELOG.md#dbt-snowflake-190---december-09-2024)
- [dbt-spark 1.9.0](https://github.com/dbt-labs/dbt-spark/blob/1.9.latest/CHANGELOG.md#dbt-spark-190---december-10-2024)
- [dbt-synapse 1.8.2](https://github.com/microsoft/dbt-synapse/blob/v1.8.latest/CHANGELOG.md)
- [dbt-teradata 1.8.2](https://github.com/Teradata/dbt-teradata/releases/tag/v1.8.2)
- [dbt-trino 1.8.5](https://github.com/starburstdata/dbt-trino/blob/master/CHANGELOG.md#dbt-trino-185---december-11-2024)
