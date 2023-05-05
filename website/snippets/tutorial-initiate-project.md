Now that you have a repository configured, you can initialize your project and start development in dbt Cloud:

1. Click **Develop** from the upper left. It might take a few minutes for your project to spin up for the first time as it establishes your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project**.  This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit**.  Use the commit message `initial commit`.  This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code. 
4. Now you should be able to **directly query data from your warehouse** and **execute dbt run**.  Paste your following warehouse-specific code in the IDE:

<WHCode>

<div warehouse="BigQuery">

```sql
select * from `dbt-tutorial.jaffle_shop.customers`
```

</div>

<div warehouse="Databricks">

```sql
select * from default.jaffle_shop_customers
```

</div>

<div warehouse="Redshift">

```sql
select * from jaffle_shop.customers
```

</div>

<div warehouse="Snowflake">

```sql
select * from raw.jaffle_shop.customers
```

</div>

</WHCode>

- In the command line bar at the bottom, type `dbt run` and click **Enter**.  We will explore what happens in the next section of the tutorial.
