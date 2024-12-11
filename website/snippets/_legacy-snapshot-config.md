
:::info
Starting from [the dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks) and dbt Core v1.9, defining snapshots in a `.sql` file using a config block is a legacy method. You can define snapshots in YAML format using the latest [snapshot-specific configurations](/docs/build/snapshots#configuring-snapshots). For new snapshots, we recommend using these latest configs. If applying them to existing snapshots, you'll need to [migrate](#snapshot-configuration-migration) over.
:::
