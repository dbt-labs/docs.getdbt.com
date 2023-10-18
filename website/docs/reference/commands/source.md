---
title: "About dbt source command"
sidebar_label: "source"
id: "source"
---

The `dbt source` command provides subcommands that are useful when working with source data. This command provides one subcommand, `dbt source freshness`.

:::info
If you're using an older version of dbt Core (before v0.21), the old name of the `freshness` subcommand was `snapshot-freshness`. (It has nothing to do with [snapshots](/docs/build/snapshots), which is why we renamed it.) Each time you see the command below, you'll need to specify it as `dbt source snapshot-freshness` instead of `dbt source freshness`.
:::

### dbt source freshness

If your dbt project is [configured with sources](/docs/build/sources), then the `dbt source freshness` command will query all of your defined source tables, determining the "freshness" of these tables. If the tables are stale (based on the `freshness` config specified for your sources) then dbt will report a warning or error accordingly. If a source <Term id="table" /> is in a stale state, then dbt will exit with a nonzero exit code.

### Specifying sources to snapshot

By default, `dbt source freshness` will calculate freshness information for all of the sources in your project. To snapshot freshness for a subset of these sources, use the `--select` flag.

```bash
# Snapshot freshness for all Snowplow tables:
$ dbt source freshness --select "source:snowplow"

# Snapshot freshness for a particular source table:
$ dbt source freshness --select "source:snowplow.event"
```

### Configuring source freshness output

When `dbt source freshness` completes, a <Term id="json" /> file containing information about the freshness of your sources will be saved to `target/sources.json`. An example `sources.json` will look like:

<File name='target/sources.json'>

```json
{
    "meta": {
        "generated_at": "2019-02-15T00:53:03.971126Z",
        "elapsed_time": 0.21452808380126953
    },
    "sources": {
        "source.project_name.source_name.table_name": {
            "max_loaded_at": "2019-02-15T00:45:13.572836+00:00Z",
            "snapshotted_at": "2019-02-15T00:53:03.880509+00:00Z",
            "max_loaded_at_time_ago_in_s": 481.307673,
            "state": "pass",
            "criteria": {
                "warn_after": {
                    "count": 12,
                    "period": "hour"
                },
                "error_after": {
                    "count": 1,
                    "period": "day"
                }
            }
        }
    }
}

```

</File>

To override the destination for this `sources.json` file, use the `-o` (or `--output`) flag:
```
# Output source freshness info to a different path
$ dbt source freshness --output target/source_freshness.json
```

### Using source freshness

Snapshots of source freshness can be used to understand:

1. If a specific data source is in a delayed state
2. The trend of data source freshness over time

This command can be run manually to determine the state of your source data freshness at any time. It is also recommended that you run this command on a schedule, storing the results of the freshness snapshot at regular intervals. These longitudinal snapshots will make it possible to be alerted when source data freshness SLAs are violated, as well as understand the trend of freshness over time.

dbt Cloud makes it easy to snapshot source freshness on a schedule, and provides a dashboard out of the box indicating the state of freshness for all of the sources defined in your project. For more information on snapshotting freshness in dbt Cloud, check out the [docs](/docs/build/sources#snapshotting-source-data-freshness).
