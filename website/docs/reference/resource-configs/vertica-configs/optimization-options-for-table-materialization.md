---
title: "Table optimization options"
sidebar_label: "Table optimizations"
description: "Configure Vertica table optimizations in dbt, including ORDER BY, SEGMENTED BY, PARTITION BY, and KSAFE clauses."
---

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
