---
title: "Using catalgos.yml"
id: catalogs-yml
sidebar_label: "Using catalogs.yml"
description: Understand how Iceberg catalogs fit into your dbt Mesh configurations.
---

dbt defines `catalogs` in a single top-level file, `catalogs.yml`, that lives in the root of your project directory.



### New spec

Available in dbt Core v1.12+

<VersionBlock firstVersion="1.12">


</VersionBlock>

### Old spec

Available in dbt Core v1.10+

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_glue_catalog
    active_write_integration: glue_rest
    write_integrations:
      - name: glue_rest
        catalog_type: iceberg_rest
        table_format: iceberg
        adapter_properties:
          catalog_linked_database: catalog_linked_db_glue
          catalog_linked_database_type: glue
```

</File>