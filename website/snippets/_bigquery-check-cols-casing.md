<VersionBlock firstVersion="1.13">

:::note BigQuery column names
In dbt v1.13 and later, the BigQuery adapter matches `check_cols` column names case-insensitively. For example, `email` matches a column named `Email`. Case sensitivity and quoted-identifier handling differ across other adapters.

Snapshot versions created before you upgrade remain in the table. If you were affected by the earlier behavior, verify which changes were genuine before removing extra rows.
:::

</VersionBlock>
