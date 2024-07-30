---
title: "Yellowbrick configurations"
description: "Yellowbrick Configurations: Read this in-depth guide to learn about configurations in dbt."
id: "yellowbrick-configs"
---

## Incremental materialization strategies

The dbt-yellowbrick adapter supports the following incremental materialization strategies:

- `append` (default when `unique_key` is not defined)
- `delete+insert` (default when `unique_key` is defined)

All of these strategies are inherited from the dbt-postgres adapter.

## Performance optimizations
    
To improve query performance, tables in Yellowbrick Data support several optimizations that can be defined 
as model-level configurations in dbt.  These will be applied to `CREATE TABLE` <Term id="ddl" /> statements 
generated at compile or run time. Note that these settings will have no effect on models set to `view` or `ephemeral`.

dbt-yellowbrick supports the following Yellowbrick-specific features when defining tables:
- `dist` - applies a single-column distribution key, or sets the distribution to `RANDOM` or `REPLICATE`
- `sort_col` - applies the `SORT ON (column)` clause that names a single column to sort on before data is stored on media
- `cluster_cols` - applies the `CLUSTER ON (column, column, ...)` clause that names up to four columns to cluster on before data is stored 
on the media

A table that has sorted or clustered columns facilitates the skipping of blocks when tables are scanned with 
restrictions applied in the query.  Further details can be found in the [Yellowbrick Data Warehouse](https://docs.yellowbrick.com/latest/ybd_sqlref/clustered_tables.html#clustered-tables) 
documentation.

### Some example model configurations

* ```DISTRIBUTE REPLICATE``` with a ```SORT``` column...

```sql
{{
  config(
    materialized = "table",
    dist = "replicate",
    sort_col = "stadium_capacity"
  )
}}

select
    hash(stg.name) as team_key
    , stg.name as team_name
    , stg.nickname as team_nickname
    , stg.city as home_city
    , stg.stadium as stadium_name
    , stg.capacity as stadium_capacity
    , stg.avg_att as average_game_attendance
    , current_timestamp as md_create_timestamp
from
    {{ source('premdb_public','team') }} stg
where
    stg.name is not null
``` 
gives the following model output:

```sql
create table if not exists marts.dim_team as (
select
    hash(stg.name) as team_key
    , stg.name as team_name
    , stg.nickname as team_nickname
    , stg.city as home_city
    , stg.stadium as stadium_name
    , stg.capacity as stadium_capacity
    , stg.avg_att as average_game_attendance
    , current_timestamp as md_create_timestamp
from
    premdb.public.team stg
where
    stg.name is not null
)
distribute REPLICATE
sort on (stadium_capacity);
```
<br />

* ```DISTRIBUTE``` on a single column and define up to four ```CLUSTER``` columns...

```sql 
{{
  config(
    materialized = 'table',
    dist = 'match_key',
    cluster_cols = ['season_key', 'match_date_key', 'home_team_key', 'away_team_key']
  )
}}

select
	hash(concat_ws('||',
	    lower(trim(s.season_name)),
		translate(left(m.match_ts,10), '-', ''),
	    lower(trim(h."name")),
		lower(trim(a."name")))) as match_key
	, hash(lower(trim(s.season_name))) as season_key
	, cast(translate(left(m.match_ts,10), '-', '') as integer) as match_date_key
	, hash(lower(trim(h."name"))) as home_team_key
	, hash(lower(trim(a."name"))) as away_team_key
	, m.htscore
	, split_part(m.htscore, '-', 1)  as home_team_goals_half_time
	, split_part(m.htscore , '-', 2)  as away_team_goals_half_time
	, m.ftscore
	, split_part(m.ftscore, '-', 1)  as home_team_goals_full_time
	, split_part(m.ftscore, '-', 2)  as away_team_goals_full_time
from
	{{ source('premdb_public','match') }} m
		inner join {{ source('premdb_public','team') }} h on (m.htid = h.htid)
		inner join {{ source('premdb_public','team') }} a on (m.atid = a.atid)
		inner join {{ source('premdb_public','season') }} s on (m.seasonid = s.seasonid)
```

gives the following model output:

```sql
create  table if not exists marts.fact_match as (
select
    hash(concat_ws('||',
        lower(trim(s.season_name)),
        translate(left(m.match_ts,10), '-', ''),
        lower(trim(h."name")),
        lower(trim(a."name")))) as match_key
    , hash(lower(trim(s.season_name))) as season_key
    , cast(translate(left(m.match_ts,10), '-', '') as integer) as match_date_key
    , hash(lower(trim(h."name"))) as home_team_key
    , hash(lower(trim(a."name"))) as away_team_key
    , m.htscore
    , split_part(m.htscore, '-', 1)  as home_team_goals_half_time
    , split_part(m.htscore , '-', 2)  as away_team_goals_half_time
    , m.ftscore
    , split_part(m.ftscore, '-', 1)  as home_team_goals_full_time
    , split_part(m.ftscore, '-', 2)  as away_team_goals_full_time
from
    premdb.public.match m
        inner join premdb.public.team h on (m.htid = h.htid)
        inner join premdb.public.team a on (m.atid = a.atid)
        inner join premdb.public.season s on (m.seasonid = s.seasonid)
)
distribute on (match_key)
cluster on (season_key, match_date_key, home_team_key, away_team_key);
```

## Cross-database materializations

Yellowbrick supports cross-database queries and the dbt-yellowbrick adapter will permit cross-database reads into a specific target on the same appliance instance.

## Limitations

This initial implementation of the dbt adapter for Yellowbrick Data Warehouse may not support some use cases. We strongly advise validating all records or transformations resulting from the adapter output.
