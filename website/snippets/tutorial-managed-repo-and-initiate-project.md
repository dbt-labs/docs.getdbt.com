dbt Cloud uses Git for version control, but using a managed repository makes this easier. To set up a managed repository:

1. Under "Add repository from", select **Managed**.
2. Type a name for your repo such as `bbaggins-dbt-quickstart`
3. Click **Create**. It will take a few seconds for your repository to be created and imported.
4. Once you see the "Successfully imported repository," click **Continue**.

Now that we have a repository configured, let's initialize your project and start development in the dbt Cloud IDE:

1. Click **Start Developing**.  You can also navigate to the Develop page from ![hamburger menu](/img/hamburger-icon.png) in the top left. It might take a few minutes for your project to spin up for the first time, as it established your git connection, clones your repo, and tests the connection to the warehouse.
2. Above the file tree to the left, click **Initialize your project**.  This builds out your folder structure with example models.
3. Make your initial commit by clicking **Commit**.  Use the commit message `initial commit`.  This creates the first commit to your managed repo and allows you to open a branch where you can add new dbt code. 
4. Now you should be able to **directly query data from your warehouse** and **execute dbt run**.  You can try this out now:
    - In "Scratchpad 1", delete all text and paste your warehouse-specific code into Scratchpad 1:

<WHCode>

<div>

```sql
select * from `dbt-tutorial.jaffle_shop.customers`
```

</div>

<div>

```sql
select * from jaffle_shop_customers
```

</div>

<div>

```sql
select * from jaffle_shop.customers
```

</div>

<div>

```sql
select * from raw.jaffle_shop.customers
```

</div>

</WHCode>

- In the command line bar at the bottom, type `dbt run` and click **Enter**.  We will explore what happens in the next section of the tutorial.
