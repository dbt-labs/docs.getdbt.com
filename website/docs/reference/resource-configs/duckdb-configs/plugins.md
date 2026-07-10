---
title: "Plugins"
sidebar_label: "Plugins"
description: "Extend dbt-duckdb with the plugin system to add custom Python UDFs and load source data from Excel, Google Sheets, and SQLAlchemy."
---

<VersionBlock lastVersion="1.99">

`dbt-duckdb` has a [plugin system](https://github.com/duckdb/dbt-duckdb#configuring-dbt-duckdb-plugins) for extending the adapter with custom Python UDFs, loading source data from Excel/Google Sheets/SQLAlchemy, and more. For details on configuring and writing plugins, refer to the [dbt-duckdb documentation on plugins](https://github.com/duckdb/dbt-duckdb#configuring-dbt-duckdb-plugins).

:::info dbt Core only
Plugins are a `dbt-duckdb` feature and are not supported in <Constant name="fusion_engine" /> or <Constant name="dbt_platform" />.
:::

</VersionBlock>
