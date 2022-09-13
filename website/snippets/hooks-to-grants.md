<VersionBlock firstVersion="1.2">

In older versions of dbt, the most common use of `post-hook` was to execute `grant` statements, to apply database permissions to models right after creating them. Starting in v1.2, we recommend using the [`grants` resource config](/reference/resource-configs/grants) instead, in order to automatically apply grants when your dbt model runs.

</VersionBlock>
