---
title: "Upgrading to v1.8 (beta)"
id: upgrading-to-v1.8
description: New features and changes in dbt Core v1.8
displayed_sidebar: "docs"
---

## Resources

- Changelog (coming soon)
- [CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- Release schedule (coming soon)

:::tip Keep on latest version, always

Starting this year, let dbt Labs handle version upgrades for you. With dbt Cloud, you can get early access to new functionality before it lands in the final release of dbt Core v1.8 and without the need of managing your own version upgrades. For more details, refer to [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

The **Keep on latest version** setting is currently available in beta for select dbt Cloud customers, rolling out to wider availability through February and March.

For users of dbt Core, the v1.8.0-b1 release of `dbt-core` & dbt Labs-maintained adapters is planned for February 28.

:::

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

## New and changed features and functionality

### Additional attributes in run_results.json

There are three attributes related to the `applied` state in the run_results.json (to complement unique_id):

- `compiled`: Boolean entry of the node compilation status (`False` after parsing, but `True` after compiling).
- `compiled_code`: rendered string of the code that was compiled (empty after parsing, but full string after compiling).
- `relation_name`: the fully-qualified name of the object that was (or will be) created/updated within the database.


## Quick hits

Coming soon!