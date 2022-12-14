---
title: "DBT-VERTICA-CONFIGS"
id: "vertica-configs"
---
**`Incremental models`**

dbt seeks to offer useful, intuitive modeling abstractions by means of its built-in configurations and materializations.

When should I use an incremental model?  

It's often desirable to build models as tables in your data warehouse since downstream queries are more performant. While the table materialization also creates your models as tables, it rebuilds the table on each dbt run. These runs can become problematic in that they use a lot of computes when either: 

source data tables have millions, or even billions, of rows. 

the transformations on the source data are computationally expensive (that is, take a long time to execute), for example, complex Regex functions, or UDFs are being used to transform data. 

Like many things in programming, incremental models are a trade-off between complexity and performance. While they are not as straightforward as the view and table materializations, they can lead to significantly better performance of your dbt runs. 

Configuring incremental strategy: The incremental strategy config can either be specified in specific models, or for all models in your dbt_project.yml file: 

**`The append Stratagy`** (default): 

Insert new records without updating or overwriting any existing data. append only adds the new records based on the condition specified in the `is_incremental()` conditional block. 

How can I run the Append incremental strategy?

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config(  materialized='incremental',     incremental_strategy='append'  ) }} 
select * from {{ ref('seed_added') }} 
{% if is_incremental() %} 
where id > (select max(id) from {{this }}) 
{% endif %} 
```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
insert into "VMart"."public"."append_data" ("id", "name", "some_date")
(
  select "id", "name", "some_date"
  from "append_data__dbt_tmp"
)
```
</File>
</TabItem>
</Tabs>

**`The merge strategy`**:

 Match records based on a `unique_key`; update old records, insert new ones. (If no `unique_key` is specified, all new data is inserted, similar to append.) 

How can I run the Merge incremental strategy? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized = "incremental", incremental_strategy = 'merge',  unique_key='id'   )  }}
select * FROM {{ ref('seed') }}
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
merge into "VMart"."public"."merge" as DBT_INTERNAL_DEST
using "merge__dbt_tmp" as DBT_INTERNAL_SOURCE   on 
DBT_INTERNAL_DEST."id" = DBT_INTERNAL_SOURCE."id"
when matched then update set
"id" = DBT_INTERNAL_SOURCE."id", "name" = DBT_INTERNAL_SOURCE."name", "some_date" = DBT_INTERNAL_SOURCE."some_date"
when not matched then insert
("id", "name", "some_date")
values(  DBT_INTERNAL_SOURCE."id", DBT_INTERNAL_SOURCE."name", DBT_INTERNAL_SOURCE."some_date"
)
```
</File>
</TabItem>
</Tabs>

**`The delete+insert strategy`**: 

Through the `delete+insert` incremental strategy, you can instruct dbt to use a two-step incremental approach. It will first delete the records detected through the configured `is_incremental()` block and re-insert them. Like the other materializations built into dbt, incremental models are defined with select statements, with the materialization defined in a config block.

How can I run the delete+insert incremental strategy? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized = "incremental", incremental_strategy = 'delete+insert', unique_key='id') }}
select  * from  {{ ref('seed') }}
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
delete from "VMart"."public"."delete"   where ( id) in (  select (id)  from "delete__dbt_tmp" );
insert into "VMart"."public"."delete" ("id", "name", "some_date")   
( select "id", "name", "some_date" from "delete__dbt_tmp" );
  ```
  </File>
</TabItem>
</Tabs>

**`The insert_overwrite strategy`**: 

If `partition_by` is specified, overwrite partitions in the table with new data. If 	no `partition_by` is specified, overwrite the entire table with new data. 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized = "incremental", incremental_strategy = 'delete+insert', unique_key='id') }}
select  * from  {{ ref('seed') }}
```
</File>
</TabItem>
<TabItem value="run">


<File name='vertica_incremental.sql'>

```sql
delete from "VMart"."public"."delete"   where ( id) in (  select (id)  from "delete__dbt_tmp" );
insert into "VMart"."public"."delete" ("id", "name", "some_date")   
 ( select "id", "name", "some_date" from "delete__dbt_tmp" );
  ```
 </File>
</TabItem>
</Tabs>


**`Table Materialization -`** 

 **`Order-By clause`** – 

 Invalid for external tables, specifies columns from the `SELECT` list on which to sort the super projection that is automatically created for this table. The `ORDER BY` clause cannot include qualifiers ASC.  Vertica always stores projection data in ascending sort order. If you omit the `ORDER BY`clause, Vertica uses the `SELECT` list order as the projection sort order. 

How can I run the Order_by for table materialization? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>

<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config(  materialized='table',  order_by='product_key') }} 
select * from public.product_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
create  table  "VMart"."public"."order_s__dbt_tmp" as 
( select * from public.product_dimension) order by product_key;
  ```
 </File>
</TabItem>
</Tabs>

**`segmentation clause`** – 

Invalid for external tables, specifies how to distribute data for `auto-projections` of this table. Supply one of the following clauses: `hash‑segmentation‑clause`: Specifies to segment data evenly and distribute across cluster nodes. Vertica recommends segmenting large tables. `Unsegmented‑clause`: Specifies to create an unsegmented projection. If this clause is omitted, Vertica generates `auto-projections` with default hash segmentation.  

Segmentation is further classified as: 

**`segmented_by_string`** :  

  How can I run the segmented_by_string? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized='table', segmented_by_string='product_key'  )  }}  
select * from public.product_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
create  table
"VMart"."public"."segmented_by__dbt_tmp"
as (select * from public.product_dimension) segmented by product_key  ALL NODES;
  ```
    
</File>
</TabItem>
</Tabs>


**`Segmented_By_all_nodes`** :  

How can I run the segmented_by_all_nodes? 
 
<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized='table', segmented_by_string='product_key' ,segmented_by_all_nodes='True' )  }}  
select * from public.product_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
create  table   "VMart"."public"."segmented_by__dbt_tmp" as
(select * from public.product_dimension)
segmented by product_key  ALL NODES;
  ```
   </File>
</TabItem>
</Tabs>

**`Partition Clause`** - 

Invalid for external tables, logically divides table data storage through a `PARTITION BY` clause. Partition clause are further classified as: 

**`partition_by_string`** : 

How can I run the partition_by_string? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized='table', partition_by_string='employee_age' )}} 
select * FROM public.employee_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
create table "VMart"."public"."test_partition__dbt_tmp" as 
( select * FROM public.employee_dimension); 
alter table "VMart"."public"."test_partition__dbt_tmp" partition BY employee_age
 ```
    
</File>
</TabItem>
</Tabs>

**`partition_by_active_count`** 

How can I run the partition_by_active_count? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{ config( materialized='table', partition_by_string='employee_age',partition_by_group_by_string="""CASE WHEN employee_age < 5 THEN 1
WHEN employee_age>50 THEN 2
ELSE 3 END""",
partition_by_active_count = 2,) }}
select * FROM public.employee_dimension
 ```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
create  table "VMart"."public"."test_partition__dbt_tmp" as
( select * FROM public.employee_dimension );
alter table "VMart"."public"."test_partition__dbt_tmp" partition BY employee_ag    group by CASE WHEN employee_age < 5 THEN 1
WHEN employee_age>50 THEN 2
ELSE 3 END
SET ACTIVEPARTITIONCOUNT 2  ;
   ```
</File>
</TabItem>
</Tabs>

 **`partition_by_group_by_string`** 

  How can I run the partition_by_group_by_String? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql

{{ config( materialized='table', partition_by_string='employee_age',partition_by_group_by_string="""CASE WHEN employee_age < 5 THEN 1
WHEN employee_age>50 THEN 2
ELSE 3 END""",
partition_by_active_count = 2,) }}
select * FROM public.employee_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
create  table "VMart"."public"."test_partition__dbt_tmp" as
 ( select * FROM public.employee_dimension );
 alter table "VMart"."public"."test_partition__dbt_tmp" partition BY employee_ag    group by CASE WHEN employee_age < 5 THEN 1
 WHEN employee_age>50 THEN 2
 ELSE 3 END
 SET ACTIVEPARTITIONCOUNT 2  ;
  ```
    
</File>
</TabItem>
</Tabs>

**`KSafe`** - 

Invalid for external tables, specifies `K-safety` of auto-projections created for this table, where k num must be equal to or greater than system K safety. If you omit this option, the projection uses the system `K-safety` level. 

  How can I run the KSafe? 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{  config(  materialized='table',    ksafe='1'   ) }} 
select * from  public.product_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
 create  table "VMart"."public"."segmented_by__dbt_tmp" as 
  (select * from  public.product_dimension ) ksafe 1;
```
</File>
</TabItem>
</Tabs>


**`No-Segmentation Clause`** – Specifies to distribute identical copies of table or projection data 	across the cluster. Use this clause to facilitate distributed query execution on tables and 	projections that are too small to benefit from segmentation. 

How can I run the No-Segmentation?

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{  config(  materialized='table',   no_segmentation='True'  ) }} 
select * from  public.product_dimension

```
</File>
</TabItem>



















































If you'd like to contribute to data platform-specifc configuration information, refer to [Documenting a new adapter](5-documenting-a-new-adapter)
