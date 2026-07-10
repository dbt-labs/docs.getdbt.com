---
title: "External tables package"
sidebar_label: "External tables"
description: "Use the dbt-external-tables package with the dbt-teradata adapter to create foreign tables from external sources."
---

The [dbt-external-tables](https://github.com/dbt-labs/dbt-external-tables) package is supported with the dbt-teradata adapter from v1.9.3 onwards. Under the hood, dbt-teradata uses the concept of foreign tables to create tables from external sources. More information can be found in the [Teradata documentation](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Data-Definition-Language-Syntax-and-Examples/Table-Statements/CREATE-FOREIGN-TABLE). 

You need to add the `dbt-external-tables` package as a dependency:

```yaml
packages:
  - package: dbt-labs/dbt_external_tables
    version: [">=0.9.0", "<1.0.0"]
```

You need to add the dispatch config for the project to pick the overridden macros from the dbt-teradata package:

```yaml
dispatch:
  - macro_namespace: dbt_external_tables
    search_order: ['dbt', 'dbt_external_tables']
```

To define `STOREDAS` and `ROWFORMAT` for external tables, one of the following options can be used:
- You can use the standard dbt-external-tables config `file_format` and `row_format` respectively.
- Or you can add it in the `USING` config as mentioned in the [Teradata documentation](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Data-Definition-Language-Syntax-and-Examples/Table-Statements/CREATE-FOREIGN-TABLE/CREATE-FOREIGN-TABLE-Syntax-Elements/USING-Clause).

For the external sources, which require authentication, you need to create an authentication object and pass it in `tbl_properties` as `EXTERNAL SECURITY` object. For more information on authentication objects, check out the [Teradata documentation](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Data-Definition-Language-Syntax-and-Examples/Authorization-Statements-for-External-Routines/CREATE-AUTHORIZATION-and-REPLACE-AUTHORIZATION).

The following are examples of external sources configured for Teradata:

```yaml
sources:
  - name: teradata_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: people_csv_partitioned
        external: 
          location: "/s3/s3.amazonaws.com/dbt-external-tables-testing/csv/"
          file_format: "TEXTFILE"
          row_format: '{"field_delimiter":",","record_delimiter":"\n","character_set":"LATIN"}'
          using: |
            PATHPATTERN  ('$var1/$section/$var3')
          tbl_properties: |
            MAP = TD_MAP1
            ,EXTERNAL SECURITY  MyAuthObj
          partitions:
            - name: section
              data_type: CHAR(1)
        columns:
          - name: id
            data_type: int
          - name: first_name
            data_type: varchar(64)
          - name: last_name
            data_type: varchar(64)
          - name: email
            data_type: varchar(64)
```

```yaml
sources:
  - name: teradata_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: people_json_partitioned
        external:
          location: '/s3/s3.amazonaws.com/dbt-external-tables-testing/json/'
          using: |
            STOREDAS('TEXTFILE')
            ROWFORMAT('{"record_delimiter":"\n", "character_set":"cs_value"}')
            PATHPATTERN  ('$var1/$section/$var3')
          tbl_properties: |
            MAP = TD_MAP1
            ,EXTERNAL SECURITY  MyAuthObj
          partitions:
            - name: section
              data_type: CHAR(1)
```

### `temporary_metadata_generation_schema` (previously `fallback_schema`)
The dbt-teradata adapter internally creates temporary tables to fetch the metadata of views for manifest and catalog creation. If you lack permission to create tables on the schema you are working with, you can define a `temporary_metadata_generation_schema` (to which you have the proper `create`/`drop` privileges) in the `dbt_project.yml` as a variable.

```yaml
vars:
  temporary_metadata_generation_schema: <schema-name>
```
