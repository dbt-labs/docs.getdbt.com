---
title: "Session info in v$session"
sidebar_label: "Session info"
description: "Supply custom session information under session_info in your profile to track dbt sessions in Oracle."
---

<VersionBlock firstVersion="1.3.2">

Custom session information can be supplied under `session_info` in `profiles.yml`


```yaml
dbt_test:
   target: dev
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         tns_name: "{{ env_var('DBT_ORACLE_TNS_NAME') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         threads: 4
         session_info:
            action: "dbt run"
            client_identifier: "dbt-unique-client-uuid"
            client_info: "dbt Python3.9 thin driver"
            module: "dbt-oracle-1.8.x"
```

This helps to track dbt sessions in the Database view [V$SESSION](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/V-SESSION.html)


</VersionBlock>
