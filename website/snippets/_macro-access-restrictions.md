<VersionBlock firstVersion="1.12">

When a macro is invoked with `dbt run-operation`, dbt doesn't enforce model access or group controls, so you can use `ref()` to reference all models (including `private` and `protected` ones).
</VersionBlock>
