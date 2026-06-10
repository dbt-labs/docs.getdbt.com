<VersionBlock firstVersion="1.12">

When a macro is invoked with `dbt run-operation`, dbt doesn't enforce model access or group controls, so you can use `ref()` to reference a `private` or `protected` model without raising a `DbtReferenceError`.

</VersionBlock>
