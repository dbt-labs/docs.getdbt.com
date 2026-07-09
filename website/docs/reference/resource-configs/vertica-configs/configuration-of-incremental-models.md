---
title: "Incremental models"
sidebar_label: "Incremental models"
description: "Configure Vertica incremental models in dbt, including on_schema_change and strategies like merge and delete+insert."
---

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


#### Configuring the `append_new_columns` parameter


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
