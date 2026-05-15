<VersionBlock firstVersion="1.12">

Macros are not subject to these access restrictions. When using [`dbt run-operation`](/reference/commands/run-operation), you can use `ref()` in a [macro](/docs/build/jinja-macros) to reference a private or protected model regardless of its access level.

</VersionBlock>
