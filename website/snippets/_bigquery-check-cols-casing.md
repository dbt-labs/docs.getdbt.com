<VersionBlock firstVersion="1.13">

:::note BigQuery column names
Starting in v1.13, BigQuery `check_cols` matches existing column names regardless of letter case. For example, `email` matches a column named `Email`. Other adapters may handle letter case and quoted identifiers differently.

Snapshot versions created before you upgrade remain in the table. If you were affected by the earlier behavior, verify which changes were genuine before removing extra rows.
:::

</VersionBlock>
