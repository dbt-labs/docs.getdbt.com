dbt Cloud uses Git for version control, but using a managed repository makes this easier. To set up a managed repository:

1. Select **Managed** from the list of repositories.
2. Type a name for your repo such as `jsmith-dbt-tutorial`
3. Click **Create** then **Continue**.
4. Optionally, you can invite other users to your dbt Cloud account:
    1. Add emails and click **Send invitations**.
    2. Click **Continue**.

Now that we have a repository configured, let's initialize your project and start development in the dbt Cloud IDE:

1. Click **Start Developing**.  Alternatively, you can find the "Develop" tab on the hamburger menu in the top left.
    > Note: This can take a few minutes for your project to spin up for the first time, as it established your git connection, clones your repo, and tests the connection to the warehouse.

2. Above the file tree on the left hand side, click “initialize your project”.  This will build out your folder structure with example models included

3. Commit your first init by clicking **Commit**.  Use the commit message `initial commit`.  This will create the first commit to your managed repo and allow you to open a new branch for adding new dbt code.

4. Now you should be able to **directly query data from your warehouse** and **execute dbt run**.  Let's try that out now:

    - In the Scratchpad 1 tab, delete all text and select from one of the tables/views you created earlier in the tutorial.

    <WHCode>

    <div>

    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`
    ```

    </div>

    <div>

    ```sql
    select * from raw.jaffle_shop.customers
    ```

    </div>

    <div>

    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`
    ```

    </div>

    <div>

    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`
    ```

    </div>

    </WHCode>

    - In the command line bar at the bottom, type in `dbt run` and click enter.  We will go deeper on what this does later in the next section of the tutorial.
