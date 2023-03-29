---
title: "Vertica configurations"
id: "vertica-configs"
---
## Configuration of Incremental Models

### Using the on_schema_change config parameter

You can use `on_schema_change` parameter with values `ignore`, `fail` and `append_new_columns`.  Value  `sync_all_columns` is not supported at this time.

#### Configuring the `ignore` (default) parameter

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', }
  ]
}>

<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
    
    {{config(materialized = 'incremental',on_schema_change='ignore')}} 
    
    select * from {{ ref('seed_added') }}


```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
      insert into "VMart"."public"."merge" ("id", "name", "some_date")
    (
        select "id", "name", "some_date"
        from "merge__dbt_tmp"
    )

```
</File>
</TabItem>
</Tabs>


#### Configuring the `fail` parameter

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
      {{config(materialized = 'incremental',on_schema_change='fail')}} 
      
      
      select * from {{ ref('seed_added') }}


```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```text
    
            The source and target schemas on this incremental model are out of sync!
              They can be reconciled in several ways:
                - set the `on_schema_change` config to either append_new_columns or sync_all_columns, depending on your situation.
                - Re-run the incremental model with `full_refresh: True` to update the target schema.
                - update the schema manually and re-run the process.

              Additional troubleshooting context:
                 Source columns not in target: {{ schema_changes_dict['source_not_in_target'] }}
                 Target columns not in source: {{ schema_changes_dict['target_not_in_source'] }}
                 New column types: {{ schema_changes_dict['new_target_types'] }}
```
</File>
</TabItem>
</Tabs>


#### Configuring the `apppend_new_columns` parameter


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
    
   
{{ config( materialized='incremental', on_schema_change='append_new_columns') }}



    select * from  public.seed_added


```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
          insert into "VMart"."public"."over" ("id", "name", "some_date", "w", "w1", "t1", "t2", "t3")
          (
                select "id", "name", "some_date", "w", "w1", "t1", "t2", "t3"
                from "over__dbt_tmp"
          )



```
</File>
</TabItem>
</Tabs>

### Using the `incremental_strategy` config ​parameter

**The `append` strategy (default)**:

Insert new records without updating or overwriting any existing data. append only adds the new records based on the condition specified in the `is_incremental()` conditional block.

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


    select * from  public.product_dimension


    {% if is_incremental() %} 
    
        where product_key > (select max(product_key) from {{this }}) 
    
    
    {% endif %}
```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
   insert into "VMart"."public"."samp" (

        "product_key", "product_version", "product_description", "sku_number", "category_description", 
        "department_description", "package_type_description", "package_size", "fat_content", "diet_type",
        "weight", "weight_units_of_measure", "shelf_width", "shelf_height", "shelf_depth", "product_price",
        "product_cost", "lowest_competitor_price", "highest_competitor_price", "average_competitor_price", "discontinued_flag")
    (
          select "product_key", "product_version", "product_description", "sku_number", "category_description", "department_description", "package_type_description", "package_size", "fat_content", "diet_type", "weight", "weight_units_of_measure", "shelf_width", "shelf_height", "shelf_depth", "product_price", "product_cost", "lowest_competitor_price", "highest_competitor_price", "average_competitor_price", "discontinued_flag"

          from "samp__dbt_tmp"
    )


```
</File>
</TabItem>
</Tabs>



**The `merge` strategy**:

Match records based on a unique_key; update old records, insert new ones. (If no unique_key is specified, all new data is inserted, similar to append.) The unique_key config parameter is required for using the merge strategy, the value accepted by this parameter is a single table column.

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

      {{ config( materialized = 'incremental', incremental_strategy = 'merge',  unique_key='promotion_key'   )  }}
      
      
          select * FROM  public.promotion_dimension


```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
       

      merge into "VMart"."public"."samp" as DBT_INTERNAL_DEST using "samp__dbt_tmp" as DBT_INTERNAL_SOURCE
          on DBT_INTERNAL_DEST."promotion_key" = DBT_INTERNAL_SOURCE."promotion_key"
  
        when matched then update set
        "promotion_key" = DBT_INTERNAL_SOURCE."promotion_key", "price_reduction_type" = DBT_INTERNAL_SOURCE."price_reduction_type", "promotion_media_type" = DBT_INTERNAL_SOURCE."promotion_media_type", "display_type" = DBT_INTERNAL_SOURCE."display_type", "coupon_type" = DBT_INTERNAL_SOURCE."coupon_type", "ad_media_name" = DBT_INTERNAL_SOURCE."ad_media_name", "display_provider" = DBT_INTERNAL_SOURCE."display_provider", "promotion_cost" = DBT_INTERNAL_SOURCE."promotion_cost", "promotion_begin_date" = DBT_INTERNAL_SOURCE."promotion_begin_date", "promotion_end_date" = DBT_INTERNAL_SOURCE."promotion_end_date"
        
        when not matched then insert
          ("promotion_key", "price_reduction_type", "promotion_media_type", "display_type", "coupon_type",
           "ad_media_name", "display_provider", "promotion_cost", "promotion_begin_date", "promotion_end_date")
        values
        (
          DBT_INTERNAL_SOURCE."promotion_key", DBT_INTERNAL_SOURCE."price_reduction_type", DBT_INTERNAL_SOURCE."promotion_media_type", DBT_INTERNAL_SOURCE."display_type", DBT_INTERNAL_SOURCE."coupon_type", DBT_INTERNAL_SOURCE."ad_media_name", DBT_INTERNAL_SOURCE."display_provider", DBT_INTERNAL_SOURCE."promotion_cost", DBT_INTERNAL_SOURCE."promotion_begin_date", DBT_INTERNAL_SOURCE."promotion_end_date"
        )


```
</File>
</TabItem>
</Tabs>



###### Using the `merge_update_columns` config parameter

The `merge_update_columns` config parameter is passed to only update the columns specified and it accepts a list of table columns.

 

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

    {{ config( materialized = 'incremental', incremental_strategy='merge', unique_key = 'id', merge_update_columns = ["names", "salary"] )}}
    
        select * from {{ref('seed_tc1')}}

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
        merge into "VMart"."public"."test_merge" as DBT_INTERNAL_DEST using "test_merge__dbt_tmp" as DBT_INTERNAL_SOURCE on  DBT_INTERNAL_DEST."id" = DBT_INTERNAL_SOURCE."id"
        
        when matched then update set
          "names" = DBT_INTERNAL_SOURCE."names", "salary" = DBT_INTERNAL_SOURCE."salary"
        
        when not matched then insert
        ("id", "names", "salary")
        values
        (
          DBT_INTERNAL_SOURCE."id", DBT_INTERNAL_SOURCE."names", DBT_INTERNAL_SOURCE."salary"
        )
```
</File>
</TabItem>
</Tabs>


**`delete+insert` strategy**: 

Through the `delete+insert` incremental strategy, you can instruct dbt to use a two-step incremental approach. It will first delete the records detected through the configured `is_incremental()` block and then re-insert them. The `unique_key` is  a required parameter for using `delete+instert` strategy which specifies how to update the records when there is duplicate data. The value accepted by this parameter is a single table column.




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

    {{ config( materialized = 'incremental', incremental_strategy = 'delete+insert',  unique_key='date_key'   )  }}


          select * FROM  public.date_dimension

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
        delete from "VMart"."public"."samp"
            where (
                date_key) in (
                select (date_key)
                from "samp__dbt_tmp"
            );

        insert into "VMart"."public"."samp" (
             "date_key", "date", "full_date_description", "day_of_week", "day_number_in_calendar_month", "day_number_in_calendar_year", "day_number_in_fiscal_month", "day_number_in_fiscal_year", "last_day_in_week_indicator", "last_day_in_month_indicator", "calendar_week_number_in_year", "calendar_month_name", "calendar_month_number_in_year", "calendar_year_month", "calendar_quarter", "calendar_year_quarter", "calendar_half_year", "calendar_year", "holiday_indicator", "weekday_indicator", "selling_season")
        (
            select "date_key", "date", "full_date_description", "day_of_week", "day_number_in_calendar_month", "day_number_in_calendar_year", "day_number_in_fiscal_month", "day_number_in_fiscal_year", "last_day_in_week_indicator", "last_day_in_month_indicator", "calendar_week_number_in_year", "calendar_month_name", "calendar_month_number_in_year", "calendar_year_month", "calendar_quarter", "calendar_year_quarter", "calendar_half_year", "calendar_year", "holiday_indicator", "weekday_indicator", "selling_season"
            from "samp__dbt_tmp"
        );

  ```
  </File>
</TabItem>
</Tabs>

**`insert_overwrite` strategy**:

The `insert_overwrite` strategy does not use a full-table scan to delete records. Instead of deleting records it drops entire partitions. This strategy may accept `partition_by_string` and `partitions` parameters. You provide these parameters when you want to overwrite a part of the table.

`partition_by_string` accepts an expression based on which partitioning of the table takes place. This is the PARTITION BY clause in Vertica.

`partitions` accepts a list of values in the partition column.

The config parameter `partitions` must be used carefully. Two situations to consider:  
-	Fewer partitions in the `partitions` parameter than in the where clause: destination table ends up with duplicates.
-	More partitions in the `partitions` parameter than in the where clause: destination table ends up missing rows. Less rows in destination than in source.

To understand more about PARTITION BY clause check [here](https://www.vertica.com/docs/9.2.x/HTML/Content/Authoring/SQLReferenceManual/Statements/partition-clause.htm)
 
:::info Note:

The `partitions` parameter is optional, if the `partitions` parameter is not provided, the partitions in the where clause will be dropped from destination and inserted back from source. If you use a where clause, you might not need the `partitions` parameter.

The where clause condition is also optional, but if not provided then all data in source is inserted in destination. 

If no where clause condition and no `partitions` parameter are provided, then it drops all partitions from the table and inserts all of them again.

If the `partitions` parameter is provided but not where clause is provided, the destination table ends up with duplicates because the partitions in the `partitions` parameter are dropped but all data in the source table (no where clause) is inserted in destination.

The `partition_by_string` config parameter is also optional. If no `partition_by_string` parameter is provided, then it behaves like `delete+insert`. It deletes all records from destination and then it inserts all records from source. It won’t use or drop partitions.

If both the `partition_by_string` and `partitions` parameters are not provided then `insert_overwrite` strategy truncates the target table and insert the source table data into target.

If you want to use `partitions` parameter then you have to partition the table by passing `partition_by_string` parameter.

:::


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
{{config(materialized = 'incremental',incremental_strategy = 'insert_overwrite',partition_by_string='YEAR(cc_open_date)',partitions=['2023'])}}


        select * from online_sales.call_center_dimension
```
</File>
</TabItem>
<TabItem value="run">


<File name='vertica_incremental.sql'>

```sql

        select PARTITION_TABLE('online_sales.update_call_center_dimension');

        SELECT DROP_PARTITIONS('online_sales.update_call_center_dimension', '2023', '2023');
      
        SELECT PURGE_PARTITION('online_sales.update_call_center_dimension', '2023');
      
        insert into "VMart"."online_sales"."update_call_center_dimension"

        ("call_center_key", "cc_closed_date", "cc_open_date", "cc_name", "cc_class", "cc_employees",
       
        "cc_hours", "cc_manager", "cc_address", "cc_city", "cc_state", "cc_region")
      
        (

            select "call_center_key", "cc_closed_date", "cc_open_date", "cc_name", "cc_class", "cc_employees",
        
            "cc_hours", "cc_manager", "cc_address", "cc_city", "cc_state", "cc_region"

            from "update_call_center_dimension__dbt_tmp"
        );


  ```
 </File>
</TabItem>
</Tabs>



## Optimization options for table materialization

There are multiple optimizations that can be used when materializing models as tables. Each config parameter applies a Vertica specific clause in the generated `CREATE TABLE` DDL. 

For more information see [Vertica](https://www.vertica.com/docs/12.0.x/HTML/Content/Authoring/SQLReferenceManual/Statements/CREATETABLE.htm) options for table optimization.

You can configure these optimizations in your model SQL file as described in the examples below: 

 ### Configuring the `ORDER BY` clause

 To leverage the `ORDER BY` clause of the `CREATE TABLE` statement use the `order_by` config param in your model. 

 #### Using the `order_by` config parameter

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
            
             ( select * from public.product_dimension)
              
                 order by product_key;

  ```
 </File>
</TabItem>
</Tabs>

### Configuring the `SEGMENTED BY` clause

To leverage the `SEGMENTED BY` clause of the `CREATE TABLE` statement, use the `segmented_by_string` or `segmented_by_all_nodes` config parameters in your model. By default  ALL NODES are used to segment tables, so the ALL NODES clause in the  SQL  statement will be added when using `segmented_by_string` config parameter. You can disable ALL NODES using `no_segmentation` parameter.

To learn more about segmented by clause check [here](https://www.vertica.com/docs/12.0.x/HTML/Content/Authoring/SQLReferenceManual/Statements/hash-segmentation-clause.htm).


#### Using the `segmented_by_string` config parameter

`segmented_by_string` config parameter  can be used to segment projection data using a SQL expression like hash segmentation.



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
        
        as (select * from public.product_dimension)
          
             segmented by product_key  ALL NODES;

  ```

</File>
</TabItem>
</Tabs>

#### Using the `segmented_by_all_nodes` config  parameter

`segmented_by_all_nodes` config parameter  can be used to segment projection data for distribution across all cluster nodes.

:::info Note:

 If you want to pass `segmented_by_all_nodes` parameter then you have to segment  the table by passing `segmented_by_string` parameter.

:::

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

### Configuring the UNSEGMENTED ALL NODES clause

To leverage the`UNSEGMENTED ALL NODES` clause of the `CREATE TABLE` statement, use the `no_segmentation` config parameters in your model.

#### Using the `no_segmentation` config parameter


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
      
     {{config(materialized='table',no_segmentation='true')}}


          select * from public.product_dimension

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
       
  
           create  table
                      "VMart"."public"."ww__dbt_tmp"
    
                   INCLUDE SCHEMA PRIVILEGES as (
    
                select * from public.product_dimension )
                
                        UNSEGMENTED ALL NODES ;
    
  

 ```

</File>
</TabItem>
</Tabs>


### Configuring the `PARTITION BY` clause

To leverage the `PARTITION BY` clause of the `CREATE TABLE` statement, use the `partition_by_string`, `partition_by_active_count` or the `partition_by_group_by_string` config parameters in your model. 

To learn more about partition by clause check [here](https://www.vertica.com/docs/9.2.x/HTML/Content/Authoring/SQLReferenceManual/Statements/partition-clause.htm)

#### Using the `partition_by_string` config parameter

`partition_by_string` (optinal) accepts a string value of a any one specific `column_name` based on which partitioning of the table data takes place.

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
        
        alter table "VMart"."public"."test_partition__dbt_tmp"
         
        partition BY employee_age


 ```

</File>
</TabItem>
</Tabs>

#### Using the `partition_by_active_count` config parameter

`partition_by_active_count` (optional) specifies how many partitions are active for this table. It accepts an integer value.

:::info Note:

 If you want to pass `partition_by_active_count` parameter then you have to partition the table by passing `partition_by_string` parameter.

:::


<Tabs
  defaultValue="source"
  values= {[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
    {{ config( materialized='table', 
    partition_by_string='employee_age',    
    partition_by_group_by_string="""
                                  CASE WHEN employee_age < 5 THEN 1
                                  WHEN employee_age>50 THEN 2
                                  ELSE 3 END""",
    
    partition_by_active_count = 2) }}


      select * FROM public.employee_dimension
 
 
 ```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
    create  table "VMart"."public"."test_partition__dbt_tmp" as
      
      ( select * FROM public.employee_dimension );
          
          alter table "VMart"."public"."test_partition__dbt_tmp" partition BY employee_ag  
          
            group by CASE WHEN employee_age < 5 THEN 1
        
        WHEN employee_age>50 THEN 2
        
        ELSE 3 END
        
        SET ACTIVEPARTITIONCOUNT 2  ;
   ```
</File>
</TabItem>
</Tabs>

#### Using the `partition_by_group_by_string` config parameter

`partition_by_group_by_string` parameter(optional) accepts  a string, in which user should specify  each group cases as a single string.

 This is derived from the `partition_by_string` value.
 
 `partition_by_group_by_string` parameter is used to merge partitions into separate partition groups. 

 
:::info Note:

 If you want to pass `partition_by_group_by_string` parameter then you have to partition the table by passing `partition_by_string` parameter.

:::



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

    {{config(materialized='table',
    partition_by_string='number_of_children', 
    partition_by_group_by_string="""
                                  CASE WHEN number_of_children <= 2 THEN 'small_family'
                                  ELSE 'big_family' END""")}}
select * from public.customer_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
      create  table "VMart"."public"."test_partition__dbt_tmp"  INCLUDE SCHEMA PRIVILEGES as 
    
        ( select * from public.customer_dimension ) ; 
        
      alter table "VMart"."public"."test_partition__dbt_tmp" 
      partition BY number_of_children
      group by CASE WHEN number_of_children <= 2 THEN 'small_family'
                                             ELSE 'big_family' END  ;
  ```

</File>
</TabItem>
</Tabs>

### Configuring the KSAFE clause

To leverage the `KSAFE` clause of the `CREATE TABLE` statement, use the `ksafe` config parameter in your model.

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
  
        (select * from  public.product_dimension ) 
            ksafe 1;
```
</File>
</TabItem>
</Tabs>

